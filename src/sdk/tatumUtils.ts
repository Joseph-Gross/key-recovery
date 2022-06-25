import { TATUM_API_KEY } from "../../config";

export async function uploadToIPFS(rawData: Uint8Array): Promise<string> {
  const form = new FormData();
  const enc = new TextEncoder();
  const stringRep = enc.decode(rawData);

  form.append("file", stringRep);

  const resp: Response = await fetch(`https://api-eu1.tatum.io/v3/ipfs`, {
    method: "POST",
    headers: {
      "x-api-key": TATUM_API_KEY,
    },
    body: form,
  });

  const data: string = await resp.text();
  return JSON.parse(data)["ipfsHash"];
}

export async function fetchFromIPFS(cid: string): Promise<string> {
  const id = "YOUR_id_PARAMETER";
  const resp = await fetch(`https://api-eu1.tatum.io/v3/ipfs/${id}`, {
    method: "GET",
    headers: {
      "x-api-key": TATUM_API_KEY,
    },
  });

  return await resp.text();
}
