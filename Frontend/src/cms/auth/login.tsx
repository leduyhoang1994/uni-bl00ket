import useAuthStore from "@/cms/stores/auth.store";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CForm,
  CFormInput,
} from "@coreui/react";
import { FormEvent } from "react";
import { useNavigate } from "react-router";
import { useToast } from "../hooks/use-toast.hook";

export default function CmsLogin() {
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      await login(username as string, password as string);

      navigate("/cms/admin");
      showSuccess("Đăng nhập thành công");
    } catch (error) {
      showError("Đăng nhập thất bại");
    }
  };

  return (
    <CContainer
      className="d-flex align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <CCard className="m-auto" style={{ minWidth: "400px" }}>
        <CCardHeader>Đăng nhập</CCardHeader>
        <CCardBody>
          <CForm className="d-flex gap-4 flex-column" onSubmit={handleSubmit}>
            <CFormInput
              name="username"
              type="text"
              floatingLabel="Tên đăng nhập"
              placeholder="Tên đăng nhập"
              required
            />
            <CFormInput
              name="password"
              type="password"
              floatingLabel="Mật khẩu"
              placeholder="Mật khẩu"
              required
            />
            <CButton
              type="submit"
              className="m-auto"
              color="primary"
              disabled={loading}
            >
              Đăng nhập
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  );
}
