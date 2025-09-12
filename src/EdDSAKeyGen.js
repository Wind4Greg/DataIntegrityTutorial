/*
TODO: Update this to produce output and files for:
    1. Raw values of private and public keys
    2. did:key representation of public key
    3. A DID document that can be used with the did:web method.

Used to generate as many Ed25519 key pairs as desired for use in
    test vectors/examples.

    From multicodec https://github.com/multiformats/multicodec#multicodec-table
    ed25519-priv  key  0x1300  draft Ed25519 private key
    ed25519-pub	  key  0xed	   draft Ed25519 public key
*/

import { mkdir, readFile, writeFile } from 'fs/promises';
import { base58btc } from "multiformats/bases/base58";
import {ed25519} from '@noble/curves/ed25519.js';
import { bytesToHex, concatBytes } from '@noble/hashes/utils.js';

const ED25519_PUB_PREFIX = 0xed;
const ED25519_PRIV_PREFIX = 0x1300;

// Used to get the prefix bytes shown below.
// let myBytes = new Uint8Array(varint.encode(ED25519_PUB_PREFIX));
// console.log(`Public Ed25519 leading bytes: ${bytesToHex(myBytes)}`);
// myBytes = new Uint8Array(varint.encode(ED25519_PRIV_PREFIX));
// console.log(`Private Ed25519 leading bytes: ${bytesToHex(myBytes)}\n`);

// Public Ed25519 leading bytes: ed01
// Private Ed25519 leading bytes: 8026
const PRIV_PREFIX = new Uint8Array([0x80, 0x26]);
const PUB_PREFIX = new Uint8Array([0xed, 0x01]);

const NUM_KEYS = 4; // Change this to whatever you want

// Create output directory for the results
const baseDir = "./output/ed25519-keypairs/";
let status = await mkdir(baseDir, {recursive: true});

let allKeys = {};
for (let i = 0; i < NUM_KEYS; i++) {
    let { secretKey, publicKey } = ed25519.keygen();
    console.log(`secret key in hex: ${bytesToHex(secretKey)}`); // Raw Hex
    console.log(`public key in hex: ${bytesToHex(publicKey)}`); // Raw Hex
    let privEncoded = base58btc.encode(concatBytes(PRIV_PREFIX, secretKey));
    let pubEncoded = base58btc.encode(concatBytes(PUB_PREFIX, publicKey));
    console.log(`did:key:${pubEncoded}`); // public as did:key
    allKeys['keyPair' + (i+1)] = {publicKeyMultibase: pubEncoded,
    privateKeyMultibase: privEncoded};
}
console.log(allKeys);
writeFile(baseDir + 'multiKeyPairs.json', JSON.stringify(allKeys, null, 2));

// const priv = ed.utils.randomPrivateKey();
// const pub = ed.getPublicKey(priv);
// console.log("private key:");
// console.log(bytesToHex(priv));
// let privEncoded = base58btc.encode(concatBytes(PRIV_PREFIX, priv));
// console.log(privEncoded);
// console.log("public key:");
// console.log(bytesToHex(pub));
// let pubEncoded = base58btc.encode(concatBytes(PUB_PREFIX, pub));
// console.log(pubEncoded);

