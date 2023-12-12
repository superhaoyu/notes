import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import LoaderButton from "../components/LoaderButton.tsx";
import { onError } from "../lib/errorLib.ts";
import { useFormFields } from "../lib/hooksLib";
import "./ForgetPassword.css"

export default function ForgetPassword() {

    const [fields, handleFieldChange] = useFormFields({
        email: "",
        code: "",
        changedPassword: "",
        confirmChangedPassword: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    // const [forgetPasswordReuqestSent, setForgetPasswordReuqestSent] = useState(false);
    const [forgetPasswordReuqestSent, setForgetPasswordReuqestSent] = useState<boolean>(false);

    const nav = useNavigate();


    async function handleForgetPasswordRequest(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);

        try {
            const data = await Auth.forgotPassword(fields.email);
            console.log(data);
            setForgetPasswordReuqestSent(true);
        } catch (error) {
            onError(error);
            setIsLoading(false);
        }

        setIsLoading(false);

    }

    function validateForm() {
        return (
            fields.email.length > 0 &&
            fields.code.length > 0 &&
            fields.changedPassword.length > 0 &&
            fields.confirmChangedPassword.length > 0 &&
            fields.confirmChangedPassword == fields.changedPassword
        );
    }

    async function handleForgetPasswordConfirm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);

        try {
            await Auth.forgotPasswordSubmit(fields.email, fields.code, fields.changedPassword)
            nav("/");
        } catch (error) {
            onError(error);
            setIsLoading(false);
        }

        setIsLoading(false);

    }

    function renderForgetPasswordSentForm() {
        return (
            <Form onSubmit={handleForgetPasswordConfirm}>
                <Stack gap={3}>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            autoFocus
                            size="lg"
                            type="email"
                            value={fields.email}
                            onChange={handleFieldChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="changedPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            size="lg"
                            type="password"
                            onChange={handleFieldChange}
                            value={fields.changedPassword}
                        />
                    </Form.Group>
                    <Form.Group controlId="confirmChangedPassword">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            size="lg"
                            type="password"
                            onChange={handleFieldChange}
                            value={fields.confirmChangedPassword}
                        />
                    </Form.Group>
                    <Form.Group controlId="code">
                        <Form.Label>OTP Code</Form.Label>
                        <Form.Control
                            size="lg"
                            type="text"
                            onChange={handleFieldChange}
                            value={fields.code}
                        />
                    </Form.Group>
                    <LoaderButton size="lg" type="submit" isLoading={isLoading} disabled={!validateForm()}>
                        Submit Email For Recovery
                    </LoaderButton>
                </Stack>
            </Form>
        );

    }

    function renderForgetPasswordNotSentForm() {
        return (
            <Form onSubmit={handleForgetPasswordRequest}>
                <Stack gap={3}>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            autoFocus
                            size="lg"
                            type="email"
                            value={fields.email}
                            onChange={handleFieldChange}
                        />
                    </Form.Group>
                    <LoaderButton size="lg" type="submit" isLoading={isLoading}>
                        Submit Email For Recovery
                    </LoaderButton>
                </Stack>
            </Form>
        );
    }

    return (
        <div className="ForgetPassword">
            {forgetPasswordReuqestSent ? (
                renderForgetPasswordSentForm()
            ) : (
                renderForgetPasswordNotSentForm()
            )}
        </div>
    );

}