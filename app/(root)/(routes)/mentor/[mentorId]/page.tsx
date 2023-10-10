import prismadb from "@/lib/prismadb";
import MentorForm from "./components/mentor-form";

interface MentorIdPageProps {
    params: {
        mentorId: string;
    };
};

const MentorIdPage = async ({params}: MentorIdPageProps) => {
    // TODO: Check Subscription

    const mentor = await prismadb.mentor.findUnique({
        where: {
            id: params.mentorId,
        }
    });

    const categories = await prismadb.category.findMany();

    return (
        <MentorForm
            initialData={mentor}
            categories={categories}
        />
    );
}

export default MentorIdPage;