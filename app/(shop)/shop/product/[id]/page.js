export const metadata = {
    title: "Product",
    description: "Page for Product",
};

export default async function Product({params}) {
    const {id} = await params

    return (
        <div>
            <h1>Product {id}</h1>
            <p>This is the Product page.</p>
            <pre>{id}</pre>
        </div>
    );
}
