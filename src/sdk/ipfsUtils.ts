// @ts-ignore
import * as LitJsSdk from "lit-js-sdk";

const AUTH_DIGEST =
  "Basic MkI1bWpncUdzNVdaOVpIRG9VdDRuWkdrVU5jOjY3MWI4YzQyZDdkNDY0OTAzMmFjMmZiNTVkYTJjZTcw";

/**
 * This function encodes into base 64.
 * it's useful for storing symkeys and files in ceramic
 * @param {Uint8Array} input a file or any data
 * @returns {string} returns a string of b64
 */
export function encodeb64(uintarray: any) {
  return Buffer.from(uintarray).toString("base64");
}

/**
 * This function converts blobs to base 64.
 * for easier storage in ceramic
 * @param {Blob} blob what you'd like to encode
 * @returns {Promise<String>} returns a string of b64
 */
export function blobToBase64(blob: Blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      resolve(
        // @ts-ignore
        reader.result.replace("data:application/octet-stream;base64,", "")
      );
    reader.readAsDataURL(blob);
  });
}

export async function uploadUint8ArrayToIPFS(
  rawData: Uint8Array
): Promise<string> {
  const form = new FormData();

  console.log(rawData);
  let encodedData = encodeb64(rawData);

  const blob = JSON.stringify({
    message: encodedData,
  });

  form.append("file", blob);

  const resp: Response = await fetch(
    `https://ipfs.infura.io:5001/api/v0/dag/put`,
    {
      method: "POST",
      headers: {
        Authorization: AUTH_DIGEST,
      },
      body: form,
    }
  );

  const data: string = await resp.text();
  console.log(data);
  return JSON.parse(data)["Cid"]["/"];
}

export async function uploadBlobToIPFS(rawData: Blob): Promise<string> {
  const form = new FormData();

  console.log(rawData);

  let encodedData = await blobToBase64(rawData);
  const blob = JSON.stringify({
    message: encodedData,
  });

  form.append("file", blob);

  const resp: Response = await fetch(
    `https://ipfs.infura.io:5001/api/v0/dag/put`,
    {
      method: "POST",
      headers: {
        Authorization: AUTH_DIGEST,
      },
      body: form,
    }
  );

  const data: string = await resp.text();
  console.log(data);
  return JSON.parse(data)["Cid"]["/"];
}

/**
 * This function decodes from base 64.
 * it's useful for decrypting symkeys and files in ceramic
 * @param {blob} input a b64 string
 * @returns {string} returns the data as a string
 */
export function decodeb64(b64String: any) {
  return new Uint8Array(Buffer.from(b64String, "base64"));
}

export async function fetchFromIPFS(cid: string): Promise<Uint8Array> {
  const resp = await fetch(
    `https://ipfs.infura.io:5001/api/v0/dag/get?arg=${cid}`,
    {
      method: "POST",
      headers: {
        Authorization: AUTH_DIGEST,
      },
    }
  );

  const text = await resp.text();
  console.log("IPFS Response: " + text);
  let jsonResp = JSON.parse(text);
  let message = jsonResp["message"];

  return decodeb64(message);
}
