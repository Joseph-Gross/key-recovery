const AUTH_DIGEST = "Basic MkI1bWpncUdzNVdaOVpIRG9VdDRuWkdrVU5jOjY3MWI4YzQyZDdkNDY0OTAzMmFjMmZiNTVkYTJjZTcw";

export async function uploadToIPFS(rawData: Uint8Array): Promise<string> {
  const form = new FormData();
  const dec = new TextDecoder();
  const stringRep = dec.decode(rawData.buffer);
  console.log(stringRep);

  const blob = JSON.stringify({
  	"message": btoa(unescape(encodeURIComponent(stringRep)))
  })

  form.append("file", blob);

  const resp: Response = await fetch(`https://ipfs.infura.io:5001/api/v0/dag/put`, {
    method: "POST",
    headers: {
      "Authorization": AUTH_DIGEST,
    },
    body: form,
  });

  const data: string = await resp.text();
  console.log(data);
  return JSON.parse(data)["Cid"]["/"];
}

export async function fetchFromIPFS(cid: string): Promise<string> {
  const resp = await fetch(`https://ipfs.infura.io:5001/api/v0/dag/get?arg=${cid}`, {
    method: "POST",
    headers: {
    	"Authorization": AUTH_DIGEST,
    },
  });
  const text = await resp.text();
  console.log(text);
  let jsonResp = JSON.parse(text);
  console.log(jsonResp);
  
  return JSON.parse(decodeURIComponent(escape(atob((jsonResp["Data"])))))["message"];
}
