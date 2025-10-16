import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const Index = () => {
  const [loanAmount, setLoanAmount] = useState([15000]);
  const [showApplication, setShowApplication] = useState(false);
  const [applicationStep, setApplicationStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    documentPhoto: null as File | null,
  });
  const [showApproval, setShowApproval] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculatePayment = () => {
    const amount = loanAmount[0];
    const rate = 0.01;
    const days = 30;
    const interest = amount * rate;
    const total = amount + interest;
    return { interest, total };
  };

  const { interest, total } = calculatePayment();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const handleApplicationSubmit = () => {
    setShowApplication(true);
    setApplicationStep(1);
    setTimeLeft(20);
    setIsTimerActive(true);
  };

  const handleFormSubmit = async () => {
    setApplicationStep(2);
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/6581a859-c6d1-4b38-bffa-b41b0ca48c24', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName,
          phone: formData.phone,
          loanAmount: loanAmount[0],
          loanTerm: 30,
          documentPhoto: formData.documentPhoto?.name || '',
        }),
      });
      
      const result = await response.json();
      
      setTimeout(() => {
        setIsSubmitting(false);
        setShowApproval(true);
      }, 1500);
    } catch (error) {
      console.error('Error sending to Bitrix24:', error);
      setTimeout(() => {
        setIsSubmitting(false);
        setShowApproval(true);
      }, 1500);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, documentPhoto: file });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white/70 backdrop-blur-xl border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
                <Icon name="Sparkles" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ФинансЭкспресс
                </h1>
                <p className="text-xs text-gray-600">Быстрые микрозаймы онлайн</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#calculator" className="text-gray-700 hover:text-purple-600 transition-all font-medium">
                Калькулятор
              </a>
              <a href="#conditions" className="text-gray-700 hover:text-purple-600 transition-all font-medium">
                Условия
              </a>
              <a href="#faq" className="text-gray-700 hover:text-purple-600 transition-all font-medium">
                Вопросы
              </a>
              <Button variant="outline" size="sm" className="border-purple-200 hover:border-purple-300">
                <Icon name="User" className="w-4 h-4 mr-2" />
                Войти
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-0 px-4 py-1.5 text-sm font-semibold">
              ⚡ Одобрение за 5 минут
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Займы до{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 animate-shimmer bg-[length:200%_auto]">
                30,000₽
              </span>
              <br />
              за 5 минут
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Современный сервис онлайн-займов с прозрачными условиями.
              <br />
              Деньги на карту моментально.
            </p>
          </div>

          <div className="max-w-3xl mx-auto" id="calculator">
            <Card className="bg-white/80 backdrop-blur-xl shadow-2xl border-purple-100 overflow-hidden animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 pointer-events-none" />
              <CardHeader className="text-center pb-8 relative">
                <CardTitle className="text-3xl text-gray-900 font-bold">Калькулятор займа</CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Рассчитайте сумму к возврату за несколько секунд
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 relative">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="amount" className="text-lg font-semibold text-gray-700">
                      Сумма займа
                    </Label>
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {loanAmount[0].toLocaleString()} ₽
                    </div>
                  </div>
                  <Slider
                    value={loanAmount}
                    onValueChange={setLoanAmount}
                    max={30000}
                    min={1000}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 font-medium">
                    <span>1,000 ₽</span>
                    <span>30,000 ₽</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 space-y-6 border border-purple-100">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                      <div className="text-sm text-gray-600 mb-2 font-medium">Срок займа</div>
                      <div className="text-2xl font-bold text-gray-900">30 дней</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                      <div className="text-sm text-gray-600 mb-2 font-medium">Ставка</div>
                      <div className="text-2xl font-bold text-gray-900">1% в день</div>
                    </div>
                  </div>

                  <div className="border-t border-purple-200 pt-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Проценты за период:</span>
                      <span className="font-bold text-gray-900 text-lg">{interest.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-sm">
                      <span className="font-semibold text-gray-900 text-lg">К возврату:</span>
                      <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-2xl">
                        {total.toLocaleString()} ₽
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleApplicationSubmit}
                  className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300"
                >
                  <Icon name="Sparkles" className="w-5 h-5 mr-2" />
                  Получить деньги
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50" id="conditions">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Преимущества</h2>
            <p className="text-gray-600 text-lg">Почему выбирают нас</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-purple-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Icon name="Zap" className="w-7 h-7 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Моментальное решение</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Автоматическое одобрение заявки за 5 минут без бумажной волокиты</p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Icon name="Shield" className="w-7 h-7 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Безопасность</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Защита персональных данных по стандартам банковской безопасности</p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Icon name="Percent" className="w-7 h-7 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Прозрачные условия</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Никаких скрытых комиссий и платежей. Все честно и понятно</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white" id="faq">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Частые вопросы</h2>
            <p className="text-gray-600 text-lg">Ответы на популярные вопросы</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border border-purple-100 rounded-2xl px-6 bg-gradient-to-br from-purple-50/30 to-blue-50/30">
              <AccordionTrigger className="text-lg font-semibold hover:text-purple-600">
                Какие документы нужны для получения займа?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base">
                Для оформления займа необходим только паспорт РФ. Никаких справок о доходах или поручителей не требуется.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-purple-100 rounded-2xl px-6 bg-gradient-to-br from-purple-50/30 to-blue-50/30">
              <AccordionTrigger className="text-lg font-semibold hover:text-purple-600">
                Как быстро деньги поступят на карту?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base">
                После одобрения заявки деньги поступают на вашу карту в течение 5-15 минут. В редких случаях перевод может занять до 24 часов.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-purple-100 rounded-2xl px-6 bg-gradient-to-br from-purple-50/30 to-blue-50/30">
              <AccordionTrigger className="text-lg font-semibold hover:text-purple-600">
                Можно ли продлить срок займа?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base">
                Да, вы можете продлить срок займа на 7, 14 или 30 дней. Для этого свяжитесь с нашей службой поддержки за день до окончания срока.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-purple-100 rounded-2xl px-6 bg-gradient-to-br from-purple-50/30 to-blue-50/30">
              <AccordionTrigger className="text-lg font-semibold hover:text-purple-600">
                Что будет, если не вернуть займ вовремя?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base">
                При просрочке начисляется пеня согласно договору. Мы всегда готовы обсудить индивидуальный график погашения.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12" id="contacts">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Icon name="Sparkles" className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">ФинансЭкспресс</h3>
              </div>
              <p className="text-gray-400 text-sm">Микрофинансовая организация</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Условия</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Вопросы</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Помощь</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Личный кабинет</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center space-x-2">
                  <Icon name="Phone" className="w-4 h-4" />
                  <span>8 (800) 555-35-35</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon name="Mail" className="w-4 h-4" />
                  <span>info@finexp.ru</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 ФинансЭкспресс. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <Dialog open={showApplication} onOpenChange={setShowApplication}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {applicationStep === 1 ? 'Заявка на займ' : 'Проверка данных'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {applicationStep === 1 
                ? 'Заполните форму для получения займа' 
                : 'Пожалуйста, подождите...'}
            </DialogDescription>
          </DialogHeader>

          {applicationStep === 1 && (
            <div className="space-y-6 py-4">
              {isTimerActive && timeLeft > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <Icon name="Clock" className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Специальное предложение!</p>
                        <p className="text-sm text-gray-600">Успейте оформить за {timeLeft} секунд</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {timeLeft}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                      Фамилия
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Иванов"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                      Имя
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Иван"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middleName" className="text-sm font-semibold text-gray-700">
                    Отчество (необязательно)
                  </Label>
                  <Input
                    id="middleName"
                    placeholder="Иванович"
                    value={formData.middleName}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                    Номер телефона
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document" className="text-sm font-semibold text-gray-700">
                    Фото паспорта (необязательно)
                  </Label>
                  <Input
                    id="document"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="border-purple-200 focus:border-purple-400"
                  />
                  <p className="text-xs text-gray-500">Разворот с фото и пропиской</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 font-medium">Сумма займа:</span>
                    <span className="text-xl font-bold text-gray-900">{loanAmount[0].toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">К возврату:</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {total.toLocaleString()} ₽
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleFormSubmit}
                disabled={!formData.firstName || !formData.lastName || !formData.phone}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
              >
                <Icon name="Send" className="w-5 h-5 mr-2" />
                Отправить заявку
              </Button>

              <p className="text-xs text-center text-gray-500">
                Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
              </p>
            </div>
          )}

          {applicationStep === 2 && !showApproval && (
            <div className="py-12 text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <Icon name="Loader2" className="w-10 h-10 text-purple-600 animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Проверяем данные...</h3>
                <p className="text-gray-600">Это займет несколько секунд</p>
              </div>
            </div>
          )}

          {showApproval && (
            <div className="py-12 text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center animate-scale-in">
                <Icon name="CheckCircle2" className="w-12 h-12 text-green-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Заявка одобрена!</h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  Деньги поступят на вашу карту в течение 15 минут
                </p>
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 max-w-sm mx-auto border border-purple-100">
                  <div className="text-sm text-gray-600 mb-2">Сумма к получению</div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {loanAmount[0].toLocaleString()} ₽
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  setShowApplication(false);
                  setShowApproval(false);
                  setApplicationStep(1);
                  setFormData({
                    firstName: '',
                    lastName: '',
                    middleName: '',
                    phone: '',
                    documentPhoto: null,
                  });
                }}
                className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Закрыть
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
