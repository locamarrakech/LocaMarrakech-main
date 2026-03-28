import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const { t, language } = useAppContext();
  const isRTL = language === 'ar';
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name as keyof ContactFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear submit status when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' });
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      errors.name = t('nameRequired');
    }
    if (!formData.email.trim()) {
      errors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('emailInvalid');
    }
    if (!formData.phone.trim()) {
      errors.phone = t('phoneRequired');
    }
    if (!formData.message.trim()) {
      errors.message = t('messageRequired');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned ${response.status}: ${response.statusText}. The API endpoint may not be configured correctly.`);
      }

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.'
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        setFormErrors({});
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Erreur lors de l\'envoi du message. Veuillez réessayer.'
        });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Une erreur est survenue. Veuillez réessayer plus tard.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block border border-gray-300 dark:border-gray-700 px-4 py-2 mb-8">
              <span className="text-xs font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400">Contact</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-light text-gray-900 dark:text-gray-100 mb-8 tracking-tight leading-tight">
              {t('contactUs')}
            </h1>

            <div className="w-16 h-px bg-gray-900 dark:bg-gray-100 mx-auto mb-8"></div>

            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-light">
              {t('contactIntro')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="border border-gray-200 dark:border-gray-700 p-8 md:p-12">
              <div className="mb-8">
                <span className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">Envoyez-nous un message</span>
                <div className="w-12 h-px bg-gray-900 dark:bg-gray-100 mt-4"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Status Message */}
                {submitStatus.type && (
                  <div className={`p-4 border ${submitStatus.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
                    : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
                    }`}>
                    <p className="text-sm">{submitStatus.message}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium mb-3 uppercase tracking-widest text-gray-700 dark:text-gray-300">
                      {t('name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${formErrors.name
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-200 dark:border-gray-700'
                        } focus:outline-none focus:border-gray-900 dark:focus:border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors`}
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium mb-3 uppercase tracking-widest text-gray-700 dark:text-gray-300">
                      {t('email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${formErrors.email
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-200 dark:border-gray-700'
                        } focus:outline-none focus:border-gray-900 dark:focus:border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors`}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-medium mb-3 uppercase tracking-widest text-gray-700 dark:text-gray-300">
                    {t('phone')} *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${formErrors.phone
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-200 dark:border-gray-700'
                      } focus:outline-none focus:border-gray-900 dark:focus:border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors`}
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium mb-3 uppercase tracking-widest text-gray-700 dark:text-gray-300">
                    {t('message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${formErrors.message
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-200 dark:border-gray-700'
                      } focus:outline-none focus:border-gray-900 dark:focus:border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors resize-none`}
                  ></textarea>
                  {formErrors.message && <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full border-2 border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-4 text-sm font-medium uppercase tracking-widest transition-colors hover:bg-white hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Envoi en cours...' : t('sendMessage')}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-12">
              {/* Contact Details */}
              <div className="border border-gray-200 dark:border-gray-700 p-8 md:p-12">
                <div className="mb-8">
                  <span className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">{t('coordinates')}</span>
                  <div className="w-12 h-px bg-gray-900 dark:bg-gray-100 mt-4"></div>
                </div>

                <div className="space-y-8">
                  {/* Address */}
                  <div className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''} gap-4`}>
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-gray-900 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-light text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wider">Adresse</h3>
                      <p className="text-gray-600 dark:text-gray-400 font-light">{t('address')}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''} gap-4`}>
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-gray-900 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-light text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wider">Email</h3>
                      <a href="mailto:contact@locamarrakech.com" className="text-gray-600 dark:text-gray-400 font-light hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                        contact@locamarrakech.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''} gap-4`}>
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-gray-900 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-light text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wider">{t('phone')}</h3>
                      <a href="tel:+212123456789" className="text-gray-600 dark:text-gray-400 font-light hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                        +212 6 27 57 30 69
                      </a>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-gray-900 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-light text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wider">{t('hours')}</h3>
                      <p className="text-gray-600 dark:text-gray-400 font-light">Ouvert 24/24 - 7j/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="border border-gray-200 dark:border-gray-700 overflow-hidden h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2649.412705282565!2d-8.016182325637775!3d31.636320541406437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafef789250cd39%3A0xbe89948fdc99a44e!2sLocaMarrakech%20%7C%20Location%20Voiture%20Marrakech!5e1!3m2!1sen!2sma!4v1774706717456!5m2!1sen!2sma"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
          <div className="border border-gray-200 dark:border-gray-700 p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-gray-100 mb-6">
              {t('needQuickResponse')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto font-light">
              {t('teamAvailable247')}
            </p>
            <a
              href="tel:+212123456789"
              className="inline-block border-2 border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-widest transition-colors hover:bg-white hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100"
            >
              {t('callUsNow')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;