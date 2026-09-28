import { integer, pgTable, varchar , uuid, text, boolean, timestamp} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(), 

    firstName: varchar("first_name",{ length: 45 }).notNull(),
    lastName: varchar("last_name",{ length: 45 }),

    age: integer("age"),

    email: varchar("email",{ length: 322 }).notNull().unique(),
    emailVarified: boolean("email_varified").default(false).notNull(),

    password: varchar("password",{length: 66}),
    salt: text("salt"),
    
    createdAt: timestamp("creatad_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(()=> new Date())
});
