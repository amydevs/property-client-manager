import fs from "fs";

export class ClientsDB {
    jsonPath: string;
    clients: TClient[];
    constructor(jsonPath: string) {
        this.jsonPath = jsonPath;
        this.clients = [];
        try {
            this.clients = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        }
        catch (err:any) {
            if (typeof err.code == "string" && err.code == "ENOENT") {
                this.write();
            }
        }
    }
    toJson(key:string, value:any) {
        switch (key) {
            case "jsonPath":
                return undefined;
        }
        return value;
    }
    write() {
        fs.writeFileSync(this.jsonPath, JSON.stringify(this, this.toJson));
    }

}

export interface TClient {
    id: number;
    fname: string;
    lname: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    notes: string;
    created: string;
    updated: string;
}