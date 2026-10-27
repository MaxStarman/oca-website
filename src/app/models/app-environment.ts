import {FirebaseOptions} from "@angular/fire/app";

// Shape of src/enviroments/enviroment*.ts. Everything here is bundled into the client, so never put secrets in it.
// Empty strings mean "not configured": Firebase is skipped and the feeds show their error state.
export interface AppEnvironment {
    production: boolean;
    firebaseConfig: FirebaseOptions;
    youtubeApiKey: string;
    instagramAccessToken: string;
    instagramAccId: string;
}
