import { Suspense } from "react";
import EditWriteupClient from "./EditWriteupClient";

const EditWriteupPage = () => (
    <Suspense fallback={<p className="text-sm text-gray-500">Loading writeup...</p>}>
        <EditWriteupClient />
    </Suspense>
);

export default EditWriteupPage;