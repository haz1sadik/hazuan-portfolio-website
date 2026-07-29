import { Suspense } from "react";
import EditEventClient from "./EditEventClient";

const EditEventPage = () => (
    <Suspense fallback={<p className="text-sm text-gray-500">Loading event...</p>}>
        <EditEventClient />
    </Suspense>
);

export default EditEventPage;