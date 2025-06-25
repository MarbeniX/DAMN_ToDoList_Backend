import server from './server';
import colors from 'colors';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});

