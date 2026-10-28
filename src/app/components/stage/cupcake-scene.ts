import {
    BufferGeometry,
    Group,
    LatheGeometry,
    Mesh,
    PerspectiveCamera,
    Scene,
    ShaderMaterial,
    Vector2,
    Vector3,
    WebGLRenderer
} from "three";
import {AudioLevels} from "../../services/audio-reactive.service";

// Plain three.js, no Angular: StageComponent lazy-loads this file, so three.js lands in its own chunk
// and only the named imports above are bundled.

export interface CupcakeSceneOptions {
    lowPower: boolean;
}

// Colors are passed as raw sRGB (no color management), so they render exactly as the palette tokens.
// No cream: that's the logo's color, and the cupcake sits right behind the logo.
const COLORS = {
    ochre: hexToVec3(0xE0892B),
    rust: hexToVec3(0xB5432A),
    cupLight: hexToVec3(0x6E3A22),
    cupDark: hexToVec3(0x2E1B10),
    teal: hexToVec3(0x4FB3A0),
};

const vertexShader = /* glsl */`
    uniform float uTime;
    uniform float uBass;
    uniform float uFrosting;

    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying vec3 vPos;

    void main() {
        vec3 pos = position;
        float angle = atan(pos.z, pos.x);
        vec3 radial = normalize(vec3(pos.x, 0.0, pos.z) + 1e-5);

        if (uFrosting > 0.5) {
            // Soft-serve swirl: a helical ridge that climbs the frosting
            pos += radial * 0.05 * sin(angle * 2.0 - pos.y * 11.0);
            // Slow breathing, pushed by the bass
            pos += normal * (0.015 + uBass * 0.05) * sin(uTime * 1.6 + pos.y * 5.0 + angle);
        }

        vPos = pos;
        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(cameraPosition - worldPos.xyz);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
`;

const fragmentShader = /* glsl */`
    uniform float uTime;
    uniform float uMid;
    uniform float uHigh;
    uniform float uHover;
    uniform float uDim;
    uniform float uFrosting;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uRim;

    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying vec3 vPos;

    void main() {
        vec3 n = normalize(vNormal);
        vec3 v = normalize(vViewDir);
        float angle = atan(vPos.z, vPos.x);

        // Warm key light from the upper left, soft fill so the shadow side never goes black
        float diffuse = 0.4 + 0.6 * max(dot(n, normalize(vec3(-0.5, 0.8, 0.6))), 0.0);

        // Liquid-light bands drifting slowly over the surface, like a 60s oil projection
        float bands = 0.5 + 0.5 * sin(vPos.y * 6.0 + angle * 2.0 - uTime * 0.5 + uMid * 1.5);
        float mixAmount = uFrosting > 0.5
            ? bands * 0.55 + vPos.y * 0.25
            : pow(abs(cos(angle * 12.0)), 2.0) * 0.7 + bands * 0.2; // cup: pleat shading
        vec3 base = mix(uColorA, uColorB, clamp(mixAmount, 0.0, 1.0));

        // Teal rim light: the one "trippy" accent, brighter with highs and on logo hover
        float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.5);
        vec3 color = base * diffuse + uRim * fresnel * (0.45 + uHigh * 0.6 + uHover * 0.5);

        color *= (1.0 + uHover * 0.2) * (1.0 - uDim * 0.75);
        gl_FragColor = vec4(color, 1.0);
    }
`;

export class CupcakeScene {

    private renderer: WebGLRenderer;
    private scene = new Scene();
    private camera = new PerspectiveCamera(35, 1, 0.1, 50);
    private cupcake = new Group();
    private materials: ShaderMaterial[] = [];
    private geometries: BufferGeometry[] = [];

    // Inputs are targets; the rendered values ease toward them every frame
    private pointer = new Vector2();
    private hoverTarget = 0;
    private scrollTarget = 0;
    private eased = {pointerX: 0, pointerY: 0, hover: 0, scroll: 0};
    private lastTime = 0;
    private aspect = 1;

    constructor(canvas: HTMLCanvasElement, private options: CupcakeSceneOptions) {
        // Throws without WebGL; StageComponent catches that and shows the static fallback
        this.renderer = new WebGLRenderer({canvas, alpha: true, antialias: !options.lowPower});
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, options.lowPower ? 1.5 : 2));

        this.camera.position.set(0, 0.25, 6.5);
        this.camera.lookAt(0, 0.1, 0);

        const segments = options.lowPower ? 64 : 128;
        this.cupcake.add(this.createCup(segments), this.createFrosting(segments));
        this.scene.add(this.cupcake);
    }

    resize(width: number, height: number): void {
        this.aspect = width / Math.max(height, 1);
        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
    }

    // x, y in -1..1 relative to the viewport center
    setPointer(x: number, y: number): void {
        this.pointer.set(x, y);
    }

    setHover(hovered: boolean): void {
        this.hoverTarget = hovered ? 1 : 0;
    }

    // 0 at the top of home, 1 when the manifesto has played through
    setScroll(progress: number): void {
        this.scrollTarget = progress;
    }

    render(timeSeconds: number, levels: AudioLevels): void {
        const dt = Math.min(timeSeconds - this.lastTime, 0.1);
        this.lastTime = timeSeconds;
        const ease = 1 - Math.exp(-dt * 4);
        const e = this.eased;
        e.pointerX += (this.pointer.x - e.pointerX) * ease;
        e.pointerY += (this.pointer.y - e.pointerY) * ease;
        e.hover += (this.hoverTarget - e.hover) * ease;
        e.scroll += (this.scrollTarget - e.scroll) * ease;

        // Fit the width on portrait phones, fill the height elsewhere
        const fit = Math.min(1, this.aspect / 0.8);
        const scale = 1.35 * fit * (1 + e.hover * 0.05 + levels.bass * 0.02) * (1 - e.scroll * 0.25);
        this.cupcake.scale.setScalar(scale);
        this.cupcake.position.y = -0.35 + e.scroll * 0.6;
        // Slow turn so the swirl keeps moving; leans toward the pointer, more when the logo is hovered
        const lean = 1 + e.hover;
        this.cupcake.rotation.set(
            0.12 + e.pointerY * 0.18 * lean,
            timeSeconds * 0.15 + e.pointerX * 0.4 + e.scroll * Math.PI,
            -e.pointerX * 0.08 * lean
        );

        for (const material of this.materials) {
            const u = material.uniforms;
            u['uTime'].value = timeSeconds;
            u['uBass'].value = levels.bass;
            u['uMid'].value = levels.mid;
            u['uHigh'].value = levels.high;
            u['uHover'].value = e.hover;
            u['uDim'].value = e.scroll;
        }
        this.renderer.render(this.scene, this.camera);
    }

    dispose(): void {
        this.geometries.forEach(geometry => geometry.dispose());
        this.materials.forEach(material => material.dispose());
        this.renderer.dispose();
    }

    // Ribbed paper cup: a lathe profile with pleats pressed in around the circumference
    private createCup(segments: number): Mesh {
        const profile = [
            [0, -1], [0.6, -1], [0.64, -0.97], [0.86, -0.06], [0.9, 0]
        ].map(([x, y]) => new Vector2(x, y));
        const geometry = new LatheGeometry(profile, segments);
        const positions = geometry.attributes['position'];
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);
            const pleat = 1 + 0.04 * Math.pow(Math.cos(Math.atan2(z, x) * 12), 2);
            positions.setXYZ(i, x * pleat, positions.getY(i), z * pleat);
        }
        geometry.computeVertexNormals();
        return this.mesh(geometry, false, COLORS.cupDark, COLORS.cupLight);
    }

    // Soft-serve frosting: three stacked rolls and a tip; the swirl itself is added in the vertex shader
    private createFrosting(segments: number): Mesh {
        const profile = [
            [0, -0.02], [0.96, -0.02], [1.06, 0.06], [1.08, 0.17], [1, 0.27], [0.86, 0.31],
            [0.92, 0.39], [0.9, 0.51], [0.76, 0.59], [0.62, 0.61],
            [0.66, 0.69], [0.6, 0.81], [0.44, 0.89], [0.3, 0.91],
            [0.26, 1.01], [0.16, 1.13], [0.05, 1.23], [0, 1.26]
        ].map(([x, y]) => new Vector2(x, y));
        const geometry = new LatheGeometry(profile, segments);
        return this.mesh(geometry, true, COLORS.ochre, COLORS.rust);
    }

    private mesh(geometry: BufferGeometry, frosting: boolean, colorA: Vector3, colorB: Vector3): Mesh {
        const material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: {value: 0},
                uBass: {value: 0},
                uMid: {value: 0},
                uHigh: {value: 0},
                uHover: {value: 0},
                uDim: {value: 0},
                uFrosting: {value: frosting ? 1 : 0},
                uColorA: {value: colorA},
                uColorB: {value: colorB},
                uRim: {value: COLORS.teal},
            }
        });
        this.geometries.push(geometry);
        this.materials.push(material);
        return new Mesh(geometry, material);
    }
}

function hexToVec3(hex: number): Vector3 {
    return new Vector3(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255);
}
