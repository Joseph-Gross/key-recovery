const TATUM_API_KEY = "e2fec12c-3054-4a69-87d5-844ecf9460e1";

export async function uploadToIPFS(rawData: Uint8Array): Promise<string> {
  const form = new FormData();
  const dec = new TextDecoder();
  const stringRep = dec.decode(rawData.buffer);
  console.log(stringRep);
  form.append("file", stringRep);

  console.log("tatumkey: " + TATUM_API_KEY);

  const resp: Response = await fetch(`https://api-us-west1.tatum.io/v3/ipfs`, {
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
  const resp = await fetch(`https://api-us-west1.tatum.io/v3/ipfs/${cid}`, {
    method: "GET",
    headers: {
      "x-api-key": TATUM_API_KEY,
    },
  });

  return JSON.parse(await resp.text())["data"];
}
