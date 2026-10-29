// Each instrument label in both languages, e.g. {sl: 'Kitara', en: 'Guitar'}
export interface InstrumentLabel {
    sl: string;
    en: string;
}

export interface Member {
    name: string;
    instruments: InstrumentLabel[];
}

// TODO(content): add each of us with every instrument we play (and later a photo + a short clip per
// instrument). The instrument orbit on the home page stays hidden while this list is empty.
// Only confirmed names and instruments go here.
export const MEMBERS: Member[] = [];
