const WEBHOOK =
    "https://hook.us2.make.com/ybpuj69ga0v91tw14hme0sa825nur9ty";

document
    .getElementById("app-form")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        // Honeypot check — bots fill this in, humans never see it
        if (document.getElementById("website_url").value.trim() !== "")
            return;

        // Validation
        const requiredFields = this.querySelectorAll("[required]");
        let valid = true;
        requiredFields.forEach(function (field) {
            field.style.borderColor = "";
            if (!field.value.trim()) {
                field.style.borderColor = "#ef4444";
                valid = false;
            }
        });

        const errorMsg = document.getElementById("error-msg");
        if (!valid) {
            errorMsg.style.display = "block";
            const firstErr = this.querySelector('[style*="ef4444"]');
            if (firstErr)
                firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }
        errorMsg.style.display = "none";

        // Collect data
        const fd = new FormData(this);
        const payload = {
            first_name: fd.get("first_name"),
            last_name: fd.get("last_name"),
            email: fd.get("email"),
            phone: fd.get("phone"),
            zip_codes: fd.get("zip_codes"),
            local_knowledge: fd.get("local_knowledge") || "",
            current_work: fd.get("current_work") || "",
            commission_experience: fd.get("commission_experience") || "",
            hours_per_week: fd.get("hours_per_week") || "",
            pitch_answer: fd.get("pitch_answer"),
            additional_info: fd.get("additional_info") || "",
            preferred_contact: fd.get("preferred_contact") || "",
            submitted_at: new Date().toISOString(),
        };

        // Disable button while submitting
        const btn = document.getElementById("submit-btn");
        btn.disabled = true;
        btn.innerHTML =
            'Submitting... <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>';

        try {
            await fetch(WEBHOOK, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } catch (err) {
            // Still show success — don't block the user on a network blip
            console.error("Webhook error:", err);
        }

        document.getElementById("form-content").style.display = "none";
        document.getElementById("success-state").style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
// Phone auto-formatter
document.getElementById("phone").addEventListener("input", function (e) {
    var digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    var formatted = "";
    if (digits.length === 0) {
        formatted = "";
    } else if (digits.length <= 3) {
        formatted = "(" + digits;
    } else if (digits.length <= 6) {
        formatted = "(" + digits.slice(0, 3) + ") " + digits.slice(3);
    } else {
        formatted =
            "(" +
            digits.slice(0, 3) +
            ") " +
            digits.slice(3, 6) +
            "-" +
            digits.slice(6);
    }
    e.target.value = formatted;
});