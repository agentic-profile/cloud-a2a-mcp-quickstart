import { useState } from "react";
import { CardTitleAndBody } from "@/components/Card";
import { EditableUrl } from "@/components/EditableUrl";
import { Button } from "@/components/Button";

export default function PublishVentureToIdentityHost() {
    const [identityHostUrl, setIdentityHostUrl] = useState("https://matchwise.ai/import");

    const handlePublish = () => {
        if (identityHostUrl) {
            console.log("Publishing to:", identityHostUrl);
            // TODO: Implement actual publish logic
        }
    };

    return (
        <CardTitleAndBody title="Publish Venture to Identity Host">
            <div className="space-y-4">
                <EditableUrl
                    label="Identity Host URL"
                    value={identityHostUrl}
                    placeholder="Enter identity host URL..."
                    onUpdate={setIdentityHostUrl}
                />
                
                <div className="flex justify-end">
                    <Button
                        onClick={handlePublish}
                        variant="primary"
                        disabled={!identityHostUrl}
                    >
                        Publish
                    </Button>
                </div>
            </div>
        </CardTitleAndBody>
    );
}