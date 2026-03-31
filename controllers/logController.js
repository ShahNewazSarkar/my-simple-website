const { ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../s3");

const BUCKET_NAME = "money-expense-tracker";

async function streamToString(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString("utf-8");
}

exports.getLogsByDate = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: "Query parameter 'date' is required in YYYY-MM-DD format" });
        }

        const parsed = new Date(date);
        if (Number.isNaN(parsed.getTime())) {
            return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
        }

        const year = parsed.getFullYear();
        const month = parsed.getMonth() + 1; // logger uses non‑padded month
        const day = parsed.getDate(); // logger uses non‑padded day

        const prefix = `logs/${year}/${month}/${day}/`;

        const listCommand = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: prefix,
        });

        const listResponse = await s3.send(listCommand);

        if (!listResponse.Contents || listResponse.Contents.length === 0) {
            return res.json({ date, logs: [] });
        }

        const logs = [];

        for (const object of listResponse.Contents) {
            const getCommand = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: object.Key,
            });

            const getResponse = await s3.send(getCommand);
            const bodyString = await streamToString(getResponse.Body);

            try {
                const parsedLog = JSON.parse(bodyString);
                logs.push({
                    key: object.Key,
                    ...parsedLog,
                });
            } catch (err) {
                logs.push({
                    key: object.Key,
                    raw: bodyString,
                    parseError: err.message,
                });
            }
        }

        return res.json({ date, logs });
    } catch (err) {
        console.error("Error fetching logs from S3:", err);
        return res.status(500).json({ error: "Failed to fetch logs from S3" });
    }
};

