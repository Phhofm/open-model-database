import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import { Model, ModelId } from 'src/lib/schema';
import { getAllModelIds, getModelData } from 'src/lib/server/data';

interface Params extends ParsedUrlQuery {
    id: ModelId;
}
interface Props {
    modelId: ModelId;
    modelData: Model;
}

export default function Page({ modelId, modelData }: Props) {
    return (
        <>
            <Head>
                <title>{`${modelData.name} - OpenModelDB`}</title>
                <meta
                    content="Generated by create next app"
                    name="description"
                />
                <meta
                    content="width=device-width, initial-scale=1"
                    name="viewport"
                />
                <link
                    href="/favicon.ico"
                    rel="icon"
                />
            </Head>
            <main>
                <div>
                    <p>{modelId}</p>
                    <p>{modelData.name}</p>
                    <br />
                    <pre>{JSON.stringify(modelData, undefined, 4)}</pre>
                </div>
            </main>
        </>
    );
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
    const modelIds = await getAllModelIds();

    return {
        paths: modelIds.map((id) => ({ params: { id } })),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<Props, Params> = async (context) => {
    const modelId = context.params?.id;
    if (!modelId) throw new Error("Missing path param 'id'");

    const modelData = await getModelData(modelId);

    return {
        props: { modelId, modelData },
    };
};