import {TATUM_API_KEY} from "../../config";


export async function uploadToIPFS(): Promise<string> {
    const form = new FormData();
    form.append("file", "127654187631872620");

    const resp: Response = await fetch(
        `https://api-eu1.tatum.io/v3/ipfs`,
        {
            method: 'POST',
            headers: {
                'x-api-key': TATUM_API_KEY
            },
            body: form
        }
    );

    const data: string = await resp.text();
    return JSON.parse(data)["ipfsHash"];
}

export async function fetchFromIPFS(cid: string): Promise<string> {
    const id = 'YOUR_id_PARAMETER';
    const resp = await fetch(
        `https://api-eu1.tatum.io/v3/ipfs/${id}`,
        {
            method: 'GET',
            headers: {
                'x-api-key': TATUM_API_KEY
            }
        }
    );

    return await resp.text();
}
