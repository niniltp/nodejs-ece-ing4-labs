import {Leveldb} from './leveldb';

export class Users {
    public username: string;
    public email: string;
    private password: string = "";

    constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
        this.username = username;
        this.email = email;

        if (!passwordHashed) {
            this.setPassword(password)
        } else this.password = password
    }

    static fromDb(username: string, value: any): Users {
        const [password, email] = value.split(":");
        return new Users(username, email, password)
    }

    public setPassword(toSet: string): void {
        // Hash and set password
        this.password = toSet;
    }

    public getPassword(): string {
        return this.password
    }

    public validatePassword(toValidate: String): boolean {
        // return comparison with hashed password
        return this.password === toValidate;
    }
}

export class UserHandler {
    public db: any;

    public get(username: string, callback: (err: Error | null, result?: Users) => void) {
        this.db.get(`user:${username}`, function (err: Error, data: any) {
            if (err) callback(err);
            else if (data === undefined) callback(null, data);
            else callback(null, Users.fromDb(username, data));
        })
    }

    public save(
        user: Users,
        callback: (err: Error | null) => void) {
        this.db.put(`user:${user.username}`, `${user.getPassword()}:${user.email}`, (err: Error | null) => {
            callback(err)
        })
    }

    public delete(username: string, callback: (err: Error | null) => void) {
        // TODO
    }

    constructor(path: string) {
        this.db = Leveldb.open(path)
    }
}