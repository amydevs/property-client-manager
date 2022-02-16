import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export class ClientsDB {
    jsonPath: string;
    clients: Client[];
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

export class FieldInfo {
    name: string;
    hidden?: boolean;
    type?: "textbox";
    constructor(name: string, hidden: boolean = false, type = undefined) {
        this.name = name;
        this.hidden = hidden;
        this.type = type;
    }
}

export class ClientInfo {
    id = new FieldInfo("id", true);
    fname = new FieldInfo("First Name");
    lname = new FieldInfo("Last Name");
    email = new FieldInfo("Email");
    phone = new FieldInfo("Phone Number");
    address = new FieldInfo("Address");
    city = new FieldInfo("City");
    state = new FieldInfo("State");
    zip = new FieldInfo("Zip Code");
    country = new FieldInfo("Country");
    notes = { name: "Notes", type: "textbox" } as FieldInfo;
    created = new FieldInfo("Created", true);
    updated = new FieldInfo("Updated", true);
    localResident = new FieldInfo("Local Resident");
    FIRB = new FieldInfo("FIRB");

    reminders = new FieldInfo("Reminders", true);
}
export class Client {
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

    reminders: Reminder[] = [];
}

export class Reminder {
    id = uuidv4();
    title = "";
    details = "";
    date = new Date();
}
