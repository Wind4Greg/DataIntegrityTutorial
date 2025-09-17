/*
    Steps to verify a signed verifiable credential in the *DataIntegrityProof*
    representation with Ed25519 signatures. Run this after DataIntegrityCreate.js
    or modify to read in a signed file of your choice. Caveat: No error checking
    is performed.
*/
import { readFile } from 'fs/promises';
import { localLoader } from './documentLoader.js';
import jsonld from 'jsonld';
import { base58btc } from "multiformats/bases/base58";
import {ed25519 as ed} from '@noble/curves/ed25519.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, concatBytes } from '@noble/hashes/utils.js';

const baseDir = "./output/";

jsonld.documentLoader = localLoader;

// Read signed input document from a file or just specify it right here.
const signedDocument = JSON.parse(
    await readFile(
      new URL(baseDir + 'signedDataInt.json', import.meta.url)
    )
  );

// Document without proof
let document = Object.assign({}, signedDocument);
delete document.proof;
// Canonize the document
let cannon = await jsonld.canonize(document);
// Hash canonized document
let canonBytes = new TextEncoder().encode(cannon);
let docHash = sha256(canonBytes); // @noble/hash will convert string to bytes via UTF-8

// Set proof options per spec
let proofConfig = {};
proofConfig.type = signedDocument.proof.type;
proofConfig.cryptosuite = signedDocument.proof.cryptosuite;
proofConfig.created = signedDocument.proof.created;
proofConfig.verificationMethod = signedDocument.proof.verificationMethod;
proofConfig.proofPurpose = signedDocument.proof.proofPurpose;
proofConfig["@context"] = signedDocument["@context"]; // Missing from draft!!!

// canonize the proof config
let proofCanon = await jsonld.canonize(proofConfig);
// Hash canonized proof config
let proofCanonBytes = new TextEncoder().encode(proofCanon);
let proofHash = sha256(proofCanonBytes); // @noble/hash will convert string to bytes via UTF-8
// Combine hashes
let combinedHash = concatBytes(proofHash, docHash); // Hash order different from draft

// Get public key
let encodedPbk = signedDocument.proof.verificationMethod.split("#")[1];
let pbk = base58btc.decode(encodedPbk);
pbk = pbk.slice(2, pbk.length); // First two bytes are multi-format indicator
console.log(`Public Key hex: ${bytesToHex(pbk)}, Length: ${pbk.length}`);

// Verify
let signature = base58btc.decode(signedDocument.proof.proofValue);
let result = await ed.verify(signature, combinedHash, pbk);
console.log(`Signature verified: ${result}`);
