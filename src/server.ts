import mongoose from 'mongoose';

import config from './app/config';
import app from './app';

async function main() {
    try {
        await mongoose.connect(config.database_url as string);
        // console.log(config.database_url)

        app.listen(config.port, () => {
            console.log(`app is listening on port ${config.port}`);
        });
    } catch (err) {
        console.log(err);
    }
}

main();
