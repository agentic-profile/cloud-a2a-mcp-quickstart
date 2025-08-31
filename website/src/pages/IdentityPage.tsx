import { Page } from '@/components';
import { CreateIdentityForm, UserProfileDisplay } from '@/components';
import { useUserProfileStore } from '@/stores';

/*
interface Service {
    name: string;
    type: string;
    id: string;
    url: string;
}

const [services] = useState<Service[]>([
    {
        name: "People connector",
        type: "A2A/venture",
        id: "venture",
        url: "http://localhost:3000/a2a/venture"
    }
]);
*/

const IdentityPage = () => {
    const { userProfile } = useUserProfileStore();

    return (
        <Page
            title="Decentralized Identity"
            subtitle="Set up your digital identity using agentic profile technology"
        >
            {userProfile ? (
                <UserProfileDisplay />
            ) : (
                <CreateIdentityForm />
            )}
        </Page>
    );
};

export default IdentityPage;
