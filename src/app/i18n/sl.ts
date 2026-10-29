// Slovene is the source language. Every key here must also exist in en.ts (enforced by TranslationKey).
// Copy rules: first person plural, minimal, only confirmed facts (see docs/design-upgrade-plan.md §0).
export const sl = {
    'nav.news': 'Novice',
    'nav.music': 'Glasba',
    'nav.contact': 'Kontakt',
    'nav.home': 'Domov',
    'nav.openMenu': 'Odpri meni',
    'nav.closeMenu': 'Zapri meni',
    'nav.main': 'Glavni meni',
    'lang.label': 'Jezik',

    'home.intro': "Smo 4-članski bando iz Kopra. Pripovedno - plesna, psihadelična rock 'n' roll mineštra po primorsko.",
    'home.manifesto1': 'Vsak od nas je virtuoz na svojem inštrumentu – in vsak igra več kot enega.',
    'home.manifesto2': 'Najprej zvok in glasba, šele nato besede.',

    'contact.titleLine1': 'ALE, DEJMO SE',
    'contact.titleLine2': 'ZMENIT',
    'contact.body': 'Organizatorji dogodkov, glasbeniki, oboževalci, hejterji in drugi! Vsi ste dobrodošli da nas kontaktirate za sodelovanje z nami in povratne informacije o nas, naši glasbi, dizajnu ali čemerkoli!',
    'contact.location': 'KOPER, SLOVENIJA',

    'news.loading': 'Nalagam objave...',
    'news.error': 'Objav trenutno ne moremo naložiti.',
    'news.empty': 'Trenutno ni novih objav.',
    'news.seeOnInstagram': 'Poglej nas na Instagramu',
    'news.followOnInstagram': 'Sledi nam na Instagramu',
    'news.otherPostAlt': 'Druga objava',

    'music.loading': 'Nalagam videe...',
    'music.error': 'Videov trenutno ne moremo naložiti.',
    'music.empty': 'Trenutno ni novih videov.',
    'music.seeOnYoutube': 'Poglej nas na YouTubu',
    'music.play': 'Predvajaj video',
};

export type TranslationKey = keyof typeof sl;

// Our signature line. Always Slovene, in both languages, never changed or translated.
export const SIGNATURE = 'EN BIŠKOTIN ČA!';
