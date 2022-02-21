import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

/** The type that the clients database file gets derserialized to */
export class ClientsDB {
    clientsPath = "";
    jsonPath: string = "";
    clients: Client[] = [];

    /** Constructor for class that takes either the path of the JSON clients database file, or an instance of it*/
    constructor(jsonPathOrInst: string | ClientsDB, clientsPath: string | undefined = undefined) {
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

        if (typeof clientsPath === "string") {
            this.clientsPath = clientsPath;
        }
        else {
            this.clientsPath = path.join(this.jsonPath, "..");
        }
    }
    //** Excludes the unneccessary content when serializing */
    toJson(key:string, value:any) {
        switch (key) {
            case "clientsPath":
            case "jsonPath":
                return undefined;
        }
        return value;
    }
    // serializes the file to and writes to the path of the clients database.
    write() {
        fs.writeFileSync(this.jsonPath, JSON.stringify(this, this.toJson));
    }

}

// type of info of each field in clientinfo
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

// Information for each field in the Client type.
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
    // Defaults for creating a new instance of Client, with uuidv4() representing a unique, randomly generated id.
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
    // Defaults for creating a new instance of Reminder, with uuidv4() representing a unique, randomly generated id.
    id = uuidv4();
    title = "";
    details = "";
    date = new Date();
}
