import { useState } from "react";
import { toast } from "react-hot-toast";

const Home = () => {
  const [phone, setPhone] = useState("");

  const isSubmitDisabled = () => {
    const isValidPhone = /^05\d{8}$/.test(phone);
    return !isValidPhone;
  };

  const handleChange = (e) => {
    const value = e.target.value;

    // إزالة أي حرف غير رقمي
    const onlyNumbers = value.replace(/\D/g, "");

    // تحديد الحد الأقصى بـ 10 أرقام
    if (onlyNumbers.length <= 10) {
      setPhone(onlyNumbers);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValidPhone = /^05\d{8}$/.test(phone);
    if (!isValidPhone) return;

    // جلب آخر وقت إرسال من localStorage
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
          style: {
            background: "#b00020",
            color: "#fff",
            borderRadius: "12px",
          },
        }
      );
      return;
    }

    document.activeElement?.blur();
    window.scrollTo({ top: 0, behavior: "smooth" });

    toast.loading("جاري إرسال طلبك...", {
      id: "updating",
    });

    try {
      const response = await fetch("https://elfahd-esim.onrender.com/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "حدث خطأ");

      // حفظ وقت الطلب في localStorage
      localStorage.setItem("lastPhoneUpdateTime", Date.now().toString());

      setPhone("");

      document.activeElement?.blur();
      window.scrollTo({ top: 0, behavior: "smooth" });

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
        style: {
          borderRadius: "12px",
          background: "#b00020",
          color: "#fff",
        },
      });

      // حفظ وقت الطلب في localStorage
      localStorage.setItem("lastPhoneUpdateTime", Date.now().toString());
    }
  };

  return (
    <div className="page-wrapper">
      <div className="form-container">
        <img src="/assets/images/logo.png" alt="متجر الفهد" className="logo" />

        <h2 className="title">مرحبًا بك!</h2>

        <p className="subtitle">الرجاء إدخال رقم الهاتف لتحديث الرقم</p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="phone" className="label">
            رقم الهاتف <strong>*</strong>
          </label>

          <input
            type="tel"
            id="phone"
            placeholder="رقم الهاتف"
            className="input"
            value={phone}
            onChange={handleChange}
          />

          {isSubmitDisabled() && phone && (
            <p className="error">الرجاء إدخال رقم هاتف صالح.</p>
          )}

          <button
            type="submit"
            className="button"
            disabled={isSubmitDisabled()}
          >
            تحديث
          </button>

          <div class="social-bar">
            <a
              href="https://wa.me/972597367603"
              class="icon whatsapp"
              target="_blank"
              title="واتساب"
              rel="noreferrer"
            >
              <i class="fab fa-whatsapp"></i>
            </a>

            <a
              href="tel:+970597367603"
              class="icon phone"
              title="اتصال مباشر"
              rel="noreferrer"
            >
              <i class="fas fa-phone-alt"></i>
            </a>

            <a
              href="https://t.me/elfahd_esim"
              class="icon telegram"
              target="_blank"
              title="تيليجرام"
              rel="noreferrer"
            >
              <i class="fab fa-telegram-plane"></i>
            </a>
          </div>
        </form>
      </div>

      <footer className="footer">
        ELFAHD Co. © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Home;
