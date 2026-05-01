import { redirect } from 'next/navigation';

const page = () => {
    redirect('/admin/dashboard/blogs');
}

export default page