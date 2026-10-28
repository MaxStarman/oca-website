import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    ViewChild
} from '@angular/core';
import {MotionService} from "../../services/motion.service";
import {AudioReactiveService} from "../../services/audio-reactive.service";
import type {CupcakeScene} from "./cupcake-scene";

let scenePromise: Promise<typeof import("./cupcake-scene")> | undefined;

// Shared so home can start the download early and hold the loading screen on it
export function loadCupcakeScene(): Promise<typeof import("./cupcake-scene")> {
    scenePromise ??= import("./cupcake-scene");
    return scenePromise;
}

/**
 * Full-screen WebGL layer behind the page content: the breathing 3D cupcake. Falls back to a static
 * cupcake when motion is reduced, WebGL is missing or the three.js chunk fails to load.
 */
@Component({
    selector: 'oca-stage',
    templateUrl: './stage.component.html',
    styleUrls: ['./stage.component.scss']
})
export class StageComponent implements AfterViewInit, OnChanges, OnDestroy {

    // The logo in front is hovered/focused: the cupcake leans in and brightens
    @Input() hovered = false;
    // Covered by something opaque (the nav overlay): stop rendering
    @Input() paused = false;

    @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    fallback: boolean;

    private scene?: CupcakeScene;
    private rafId = 0;
    private lastFrame = 0;
    private onScreen = true;
    private covered = false;
    private destroyed = false;
    private cleanups: (() => void)[] = [];

    constructor(private host: ElementRef<HTMLElement>,
                private ngZone: NgZone,
                private changeDetector: ChangeDetectorRef,
                private motion: MotionService,
                private audio: AudioReactiveService) {
        this.fallback = motion.reducedMotion;
    }

    ngOnChanges(): void {
        this.scene?.setHover(this.hovered);
        this.updateLoop();
    }

    async ngAfterViewInit(): Promise<void> {
        if (this.fallback) {
            return;
        }
        try {
            const {CupcakeScene} = await loadCupcakeScene();
            if (this.destroyed) {
                return;
            }
            this.scene = new CupcakeScene(this.canvasRef.nativeElement, {lowPower: this.motion.isLowPower});
        } catch {
            this.fallback = true;
            this.changeDetector.detectChanges();
            return;
        }
        this.scene.setHover(this.hovered);
        // Everything per-frame or per-pointer-move runs outside Angular: no change detection 60x a second
        this.ngZone.runOutsideAngular(() => this.listen());
        this.updateLoop();
    }

    // 0..1, driven by the home page's scroll scene
    setScrollProgress(progress: number): void {
        this.scene?.setScroll(progress);
    }

    // Fully hidden behind opaque page content (e.g. the footer video): stop rendering.
    // Separate from `paused` because it is driven per scroll frame, outside change detection.
    setCovered(covered: boolean): void {
        this.covered = covered;
        this.updateLoop();
    }

    ngOnDestroy(): void {
        this.destroyed = true;
        cancelAnimationFrame(this.rafId);
        this.cleanups.forEach(cleanup => cleanup());
        this.scene?.dispose();
    }

    private listen(): void {
        const hostElement = this.host.nativeElement;

        const resizeObserver = new ResizeObserver(() =>
            this.scene?.resize(hostElement.clientWidth, hostElement.clientHeight));
        resizeObserver.observe(hostElement);

        const visibilityObserver = new IntersectionObserver(entries => {
            this.onScreen = entries[entries.length - 1].isIntersecting;
            this.updateLoop();
        });
        visibilityObserver.observe(hostElement);

        const onPointerMove = (event: PointerEvent) => this.scene?.setPointer(
            (event.clientX / window.innerWidth) * 2 - 1,
            -((event.clientY / window.innerHeight) * 2 - 1)
        );
        const onVisibilityChange = () => this.updateLoop();
        window.addEventListener('pointermove', onPointerMove, {passive: true});
        document.addEventListener('visibilitychange', onVisibilityChange);

        this.cleanups.push(
            () => resizeObserver.disconnect(),
            () => visibilityObserver.disconnect(),
            () => window.removeEventListener('pointermove', onPointerMove),
            () => document.removeEventListener('visibilitychange', onVisibilityChange)
        );
    }

    // Render only while something can actually be seen
    private updateLoop(): void {
        const shouldRun = !!this.scene && this.onScreen && !this.covered && !this.paused && !document.hidden;
        cancelAnimationFrame(this.rafId);
        this.rafId = 0;
        if (shouldRun) {
            this.ngZone.runOutsideAngular(() => this.rafId = requestAnimationFrame(this.frame));
        }
    }

    private frame = (now: number): void => {
        this.rafId = requestAnimationFrame(this.frame);
        // 30 fps is plenty for a slow breathing shape and halves the battery cost on phones
        if (this.motion.isLowPower && now - this.lastFrame < 1000 / 30 - 2) {
            return;
        }
        this.lastFrame = now;
        const seconds = now / 1000;
        this.scene!.render(seconds, this.audio.read(seconds));
    };
}
