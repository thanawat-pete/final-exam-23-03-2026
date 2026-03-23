import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import useLanguageStore from "../stores/useLanguageStore";

const SigninPage = () => {
  const { t } = useLanguageStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (_) {
      // Error handled by store toast
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-200">
        <div className="card-body">
          <div className="flex flex-col items-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <LogIn className="w-12 h-12 text-primary" />
            </div>
            <h2 className="card-title text-3xl font-bold">{t("welcome_back")}</h2>
            <p className="text-base-content/60">{t("signin_to_manage")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">{t("email")}</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50 z-10 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="input input-bordered w-full pl-10 focus:input-primary bg-base-200/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">{t("password")}</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50 z-10 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 focus:input-primary bg-base-200/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full text-lg shadow-lg shadow-primary/20 ${loading ? "btn-disabled" : ""}`}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" /> : t("signin")}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-base-content/60">
              {t("dont_have_account")}{" "}
              <Link to="/signup" className="link link-primary font-black">
                {t("signup")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
