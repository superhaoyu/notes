import dynamodb from "@notes/core/dynamodb";
import handler from "@notes/core/handler";
import { Table } from "sst/node/table";

export const main = handler(async (event) => {

    const params = {
        TableName: Table.Notes.tableName,
        Key: {
            userId: "123",
            noteId: event?.pathParameters?.id,
        }
    };

    const res = await dynamodb.get(params);

    if (!res.Item) {
        throw new Error("Item not found");
    }

    return JSON.stringify(res.Item);

} );