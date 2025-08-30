import { 

    UserGroupIcon,

} from '@heroicons/react/24/outline';
import { Card, CardBody } from '@/components/Card';
import { Button } from '@heroui/react';
import Page from '@/components/Page';

const VenturePage = () => {


    return (
        <Page
            title="Venture Agent"
            subtitle="Your AI-powered business development partner for strategic growth and partnerships"
            maxWidth="6xl"
        >
            <div className="text-center">
                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                    <CardBody>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Ready to Accelerate Your Business Growth?
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                            Let the Venture Agent help you build strategic partnerships and unlock new opportunities
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                color="primary"
                                size="lg"
                                variant="solid"
                                startContent={<UserGroupIcon className="w-5 h-5" />}
                            >
                                Start Partnership Search
                            </Button>
                            <Button
                                color="secondary"
                                size="lg"
                                variant="bordered"
                                startContent={<UserGroupIcon className="w-5 h-5" />}
                            >
                                Learn More
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </Page>
    );
};

export default VenturePage;
