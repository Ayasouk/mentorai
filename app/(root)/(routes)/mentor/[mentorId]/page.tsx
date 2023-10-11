import prismadb from "@/lib/prismadb";
import MentorForm from "./components/mentor-form";
import { auth, redirectToSignIn } from "@clerk/nextjs";

interface MentorIdPageProps {
    params: {
        mentorId: string;
    };
};

const MentorIdPage = async ({params}: MentorIdPageProps) => {
    const {userId} = auth(); 
    // TODO: Check Subscription

    if(!userId) {
        return redirectToSignIn();
    }

    const mentor = await prismadb.mentor.findUnique({
        where: {
            id: params.mentorId,
            userId
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