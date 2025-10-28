import 'dotenv/config';

import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import {
    prettyJson,
    createAgenticProfile,
} from "@agentic-profile/common";
import {
    createEdDsaJwk
} from "@agentic-profile/auth";
import { __dirname } from "./util.js";


(async ()=>{
    const { profile, keyring } = await createAgenticProfile({ services:[], createJwkSet: createEdDsaJwk });
    
    // add a #system-key to the profile and keyring
    const systemKey = await createEdDsaJwk();
    profile.verificationMethod.push({
        id: "#system-key",
        type: "JsonWebKey2020",
        publicKeyJwk: systemKey.publicJwk
    });
    keyring.push({ ...systemKey, id: "#system-key" });

    console.log('Profile created successfully');
    
    try {
        // save as our well-known profile for the website
        let dir = join(__dirname, "..", "src");
        await mkdir(dir, { recursive: true });
        await writeFile(
            join(dir, "well-known-did-document.json"),
            prettyJson(profile),
            "utf8"
        );

        // save keyring for pushing to cloud
        dir = join( __dirname, ".." );
        await writeFile(
            join(dir, "keyring.json"),
            prettyJson(keyring),
            "utf8"
        );
        
        console.log('Profile and keyring saved successfully');
    } catch(error) {
        console.log( "Failed to save profile", error );
    }
})();