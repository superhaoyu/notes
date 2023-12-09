import dynamodb from "@notes/core/dynamodb";
import handler from "@notes/core/handler";
import { Table } from "sst/node/table";

export const main = handler(async (event) => {

    const params = {
        TableName: Table.Notes.tableName,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
        },
    };

    const res = await dynamodb.query(params);

    return JSON.stringify(res.Items);

} );