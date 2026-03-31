// middleware/logger.js
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require(".s3");
const { v4: uuidv4 } = require("uuid");

const BUCKET_NAME = "money-expense-tracker";

const loggerMiddleware = (req, res, next) => {
    const startTime = Date.now();

    let oldSend = res.send;

    let responseBody;

    res.send = function (body) {
        responseBody = body;
        oldSend.apply(res, arguments);
    };

    res.on("finish", async () => {
        try {
            const logData = {
                request: {
                    method: req.method,
                    url: req.originalUrl,
                    headers: req.headers,
                    body: req.body,
                    params: req.params,
                    query: req.query,
                },
                response: {
                    statusCode: res.statusCode,
                    body: responseBody,
                },
                meta: {
                    timestamp: new Date().toISOString(),
                    responseTime: Date.now() - startTime,
                },
            };

            const date = new Date();
            const key = `logs/${date.getFullYear()}/${
                date.getMonth() + 1
            }/${date.getDate()}/${uuidv4()}.json`;

            const command = new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key,
                Body: JSON.stringify(logData),
                ContentType: "application/json",
            });

            await s3.send(command);
        } catch (err) {
            console.error("S3 Logging Error:", err);
        }
    });

    next();
};

module.exports = loggerMiddleware;