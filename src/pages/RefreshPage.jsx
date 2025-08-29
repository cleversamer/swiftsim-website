import { useState } from "react";
import { toast } from "react-hot-toast";
import styled, { keyframes } from "styled-components";

const RefreshPage = () => {
  const [phone, setPhone] = useState("");

  const isSubmitDisabled = () => {
    const isValidPhone = /^05\d{8}$/.test(phone);
    return !isValidPhone;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const onlyNumbers = value.replace(/\D/g, "");
    if (onlyNumbers.length <= 10) setPhone(onlyNumbers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValidPhone = /^05\d{8}$/.test(phone);
    if (!isValidPhone) return;

    const lastRequestTime = localStorage.getItem("lastPhoneUpdateTime");
    const now = Date.now();
    const FIVE_MINUTES = 5 * 60 * 1000;

    if (lastRequestTime && now - parseInt(lastRequestTime) < FIVE_MINUTES) {
      const remainingSeconds = Math.ceil(
        (FIVE_MINUTES - (now - lastRequestTime)) / 1000
      );
      document.activeElement?.blur();
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error(
        `يرجى الانتظار ${remainingSeconds} ثانية قبل المحاولة مرة أخرى`,
        {
          duration: 1500,
          style: { background: "#b00020", color: "#fff", borderRadius: "12px" },
        }
      );
      return;
    }

    document.activeElement?.blur();
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.loading("جاري إرسال طلبك...", { id: "updating" });

    try {
      const response = await fetch("https://elfahd-esim.onrender.com/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "حدث خطأ");
      localStorage.setItem("lastPhoneUpdateTime", Date.now().toString());
      setPhone("");
      toast.success(data.message || "تم إرسال طلبك بنجاح", {
        id: "updating",
        duration: 3000,
        style: {
          borderRadius: "12px",
          background: "#333",
          color: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
      });
      setTimeout(() => {
        toast.success("يرجى إيقاف تشغيل هاتف لمدة 10 دقائق الآن", {
          duration: 10000,
          style: {
            borderRadius: "12px",
            background: "#333",
            color: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        });
      }, 1500);
    } catch (err) {
      document.activeElement?.blur();
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error(err.message || "فشل في إرسال الطلب", {
        id: "updating",
        duration: 4000,
        style: { borderRadius: "12px", background: "#b00020", color: "#fff" },
      });
      localStorage.setItem("lastPhoneUpdateTime", Date.now().toString());
    }
  };

  return (
    <PageWrapper>
      <FormContainer>
        <Logo
          src="/assets/images/logo-nobackground-5000.png"
          alt="متجر الفهد"
        />
        <Title>مرحبًا بك!</Title>
        <Subtitle>الرجاء إدخال رقم الهاتف لتحديث الرقم</Subtitle>

        <Form onSubmit={handleSubmit}>
          <Label htmlFor="phone">
            رقم الهاتف <strong>*</strong>
          </Label>

          <Input
            type="tel"
            id="phone"
            placeholder="رقم الهاتف"
            value={phone}
            onChange={handleChange}
          />

          {isSubmitDisabled() && phone && (
            <ErrorText>الرجاء إدخال رقم هاتف صالح.</ErrorText>
          )}

          <Button type="submit" disabled={isSubmitDisabled()}>
            تحديث
          </Button>

          <SocialBar>
            <IconLink
              href="https://wa.me/972597367603"
              target="_blank"
              title="واتساب"
              rel="noreferrer"
              type="whatsapp"
            >
              <i className="fab fa-whatsapp"></i>
            </IconLink>

            <IconLink
              href="tel:+970597367603"
              title="اتصال مباشر"
              rel="noreferrer"
              type="phone"
            >
              <i className="fas fa-phone-alt"></i>
            </IconLink>

            <IconLink
              href="https://t.me/elfahd_esim"
              target="_blank"
              title="تيليجرام"
              rel="noreferrer"
              type="telegram"
            >
              <i className="fab fa-telegram-plane"></i>
            </IconLink>
          </SocialBar>
        </Form>

        <Footer>Swift Sim Co. © {new Date().getFullYear()}</Footer>
      </FormContainer>
    </PageWrapper>
  );
};

// ===== Animations =====
const fadeSlideUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const fadeInBg = keyframes`
  to { opacity: 0.15; }
`;

const logoEntrance = keyframes`
  0% { opacity: 0; transform: scale(0.9) translateY(20px) rotate(-10deg); }
  50% { opacity: 1; transform: scale(1.05) translateY(-10px) rotate(5deg); }
  100% { transform: scale(1) translateY(0) rotate(0deg); }
`;

// ===== Styled Components =====
const PageWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* background: linear-gradient(to top right, white, #e0f0ff); */
  overflow: hidden;
  padding: 20px;
  direction: rtl;
  font-family: "Cairo", sans-serif;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: url("/assets/images/background-compressed.jpg") no-repeat center
      center;
    background-size: cover;
    /* opacity: 0; */
    /* animation: ${fadeInBg} 1.5s ease-out forwards 0.3s; */
    z-index: 0;
  }
`;

const FormContainer = styled.div`
  background: white;
  padding: 40px 40px 15px 40px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 1;
  animation: ${fadeSlideUp} 1.5s ease-out both;

  @media (max-width: 480px) {
    padding: 20px 20px 15px 20px;
    border-radius: 16px;
  }
`;

const Logo = styled.img`
  width: 160px;
  animation: ${logoEntrance} 1.5s ease-out both 0.3s;

  @media (max-width: 480px) {
    width: 120px;
  }
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;

  @media (max-width: 480px) {
    font-size: 13px;
    margin-bottom: 16px;
  }
`;

const ErrorText = styled.p`
  font-size: 14px;
  color: #e53935;
  margin-top: -10px;
  margin-bottom: 16px;
`;

const Form = styled.form`
  text-align: right;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #444;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: right;
  outline-color: transparent;
  transition: outline-color 0.3s ease-in-out, outline-offset 0.3s;

  &:focus {
    outline-color: #106d68;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

const Button = styled.button`
  width: 100%;
  /* background-color: ${(props) =>
    props.disabled ? "lightgray" : "#2196f3"}; */
  background-color: ${(props) => (props.disabled ? "lightgray" : "#106d68")};
  color: white;
  padding: 10px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.disabled ? "lightgray" : "#1976d2")};
  }

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const Footer = styled.footer`
  font-weight: 700;
  font-size: 14px;
  color: #272727; /* داكن قريب من الأسود */
  text-align: center;
  margin-top: 20px;

  @media (max-width: 480px) {
    font-size: 12px;
    margin-top: 10px;
  }
`;

const SocialBar = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;
  padding: 15px;
  margin-top: 15px;
`;

const IconLink = styled.a`
  width: ${(props) => (props.type === "phone" ? "48px" : "42px")};
  height: ${(props) => (props.type === "phone" ? "48px" : "42px")};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: white;
  text-decoration: none;
  transition: transform 0.2s ease;
  background-color: ${(props) =>
    props.type === "whatsapp"
      ? "#25d366"
      : props.type === "telegram"
      ? "#0088cc"
      : "#106d68"};

  &:hover {
    transform: scale(1.1);
  }
`;

export default RefreshPage;
