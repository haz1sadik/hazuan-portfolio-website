import { Suspense } from "react";
import EditGuideClient from "./EditGuideClient";

const EditGuidePage = () => (
    <Suspense fallback={<p className="text-sm text-gray-500">Loading guide...</p>}>
        <EditGuideClient />
    </Suspense>
);

export default EditGuidePage;