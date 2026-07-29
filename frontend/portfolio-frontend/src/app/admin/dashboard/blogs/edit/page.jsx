import { Suspense } from "react";
import EditBlogClient from "./EditBlogClient";

const EditBlogPage = () => (
    <Suspense fallback={<p className="text-sm text-gray-500">Loading blog...</p>}>
        <EditBlogClient />
    </Suspense>
);

export default EditBlogPage;