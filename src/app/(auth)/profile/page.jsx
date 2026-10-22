"use client";

import { updateUser } from "@/lib/auth-client";
import { FloppyDisk } from "@gravity-ui/icons";
import {
    Button,
    Description,
    FieldError,
    FieldGroup,
    Fieldset,
    Form,
    Input,
    Label,
    TextField,
    toast,
} from "@heroui/react";

export default function ProfilePage() {
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const userData = Object.fromEntries(formData.entries());

        try {
            await updateUser({
                name: userData.name,
            });

            // Trigger Toast Notification
            toast.success("Profile updated successfully!", {
                description: "Your changes have been saved.",
            });
        } catch (error) {
            toast.danger("Failed to update profile", {
                description: "Please try again later.",
            });
        }
    };

    return (
        <Form className="w-full max-w-96" onSubmit={handleUpdateUser}>
            <Fieldset>
                <Fieldset.Legend>Profile Settings</Fieldset.Legend>
                <Description>Update your profile information.</Description>
                <FieldGroup>
                    <TextField
                        isRequired
                        name="name"
                        validate={(value) => {
                            if (value.length < 3) {
                                return "Name must be at least 3 characters";
                            }
                            return null;
                        }}
                    >
                        <Label>Name</Label>
                        <Input placeholder="Provide your full name" />
                        <FieldError />
                    </TextField>
                </FieldGroup>
                <Fieldset.Actions>
                    <Button type="submit">
                        <FloppyDisk />
                        Save changes
                    </Button>
                    <Button type="reset" variant="secondary">
                        Cancel
                    </Button>
                </Fieldset.Actions>
            </Fieldset>
        </Form>
    );
}