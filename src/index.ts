// import { seed } from 'drizzle-seed';
import app from './app';

import env from './config';
// import db from './db';
// import { user } from './db/schema/user.schema';

// seed(db, { user }).then(() => {
//     console.log('Database seeded');
// });

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});
