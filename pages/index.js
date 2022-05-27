import styles from '../styles/Home.module.css';
import Head from 'next/head';

const Home = () => {
    return (
        <>
            <div className={styles.container}>
                <Head>
                    <title> Food Ordering App </title>
                    <meta
                        name="description"
                        content="Generated by nextjs Food Ordering App"
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                Food Ordering App
            </div>
        </>
    );
};

export default Home;
