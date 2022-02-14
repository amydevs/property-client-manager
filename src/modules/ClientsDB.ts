import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export class ClientsDB {
    jsonPath: string;
    clients: IClient[];
    constructor(jsonPathOrInst: string | ClientsDB) {
        this.clients = [];
        this.jsonPath = "";
        if (typeof jsonPathOrInst == "string") {
            this.jsonPath = jsonPathOrInst;
            try {
                Object.assign(this, JSON.parse(fs.readFileSync(jsonPathOrInst, "utf-8")));
            }
            catch (err:any) {
                if (typeof err.code == "string" && err.code == "ENOENT") {
                    this.write();
                }
            }
        }
        else {
            Object.assign(this, jsonPathOrInst);
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

export interface IClient {
    id: string;
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
    created: Date;
    updated: Date;
    localResident: Boolean;
    FIRB: Boolean;
}

export class Client implements IClient {
    id = uuidv4();
    fname = "";
    lname = "";
    email = "";
    phone = "";
    address = "";
    city = "";
    state = "";
    zip = "";
    country = "";
    notes = "";
    created = new Date();
    updated = new Date();
    localResident = false;
    FIRB = false;
}