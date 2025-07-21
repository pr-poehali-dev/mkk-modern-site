import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [loanAmount, setLoanAmount] = useState([15000]);
  const [showApplication, setShowApplication] = useState(false);

  const calculatePayment = () => {
    const amount = loanAmount[0];
    const rate = 0.01; // 1%
    const days = 30;
    const interest = amount * rate;
    const total = amount + interest;
    return { interest, total };
  };

  const { interest, total } = calculatePayment();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Icon name="DollarSign" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ФинансЭкспресс</h1>
                <p className="text-sm text-gray-600">Микрофинансовая организация</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#calculator" className="text-gray-700 hover:text-blue-600 transition-colors">Калькулятор</a>
              <a href="#conditions" className="text-gray-700 hover:text-blue-600 transition-colors">Условия</a>
              <a href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors">Вопросы</a>
              <a href="#contacts" className="text-gray-700 hover:text-blue-600 transition-colors">Контакты</a>
              <Button variant="outline" size="sm">
                <Icon name="Phone" className="w-4 h-4 mr-2" />
                Личный кабинет
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">
              Одобрение за 5 минут
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Займы до <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">30,000₽</span>
              <br />за 5 минут
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Быстрое одобрение, выгодные условия и прозрачные проценты. 
              Получите деньги на карту уже сегодня.
            </p>
          </div>

          {/* Calculator Card */}
          <div className="max-w-2xl mx-auto" id="calculator">
            <Card className="bg-white/90 backdrop-blur-lg shadow-2xl border-0 p-2">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-gray-900">Калькулятор займа</CardTitle>
                <CardDescription className="text-gray-600">
                  Рассчитайте сумму к возврату и подайте заявку
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="amount" className="text-lg font-medium">Сумма займа</Label>
                    <div className="text-2xl font-bold text-blue-600">{loanAmount[0].toLocaleString()} ₽</div>
                  </div>
                  <Slider
                    value={loanAmount}
                    onValueChange={setLoanAmount}
                    max={30000}
                    min={1000}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1,000 ₽</span>
                    <span>30,000 ₽</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Срок займа</div>
                      <div className="text-xl font-semibold text-gray-900">30 дней</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Процентная ставка</div>
                      <div className="text-xl font-semibold text-gray-900">1%</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-blue-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Проценты за период:</span>
                      <span className="font-semibold">{interest.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-medium text-gray-900">К возврату:</span>
                      <span className="font-bold text-blue-600 text-xl">{total.toLocaleString()} ₽</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowApplication(true)}
                  className="w-full py-4 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                >
                  <Icon name="CreditCard" className="w-5 h-5 mr-2" />
                  Подать заявку
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Преимущества нашей компании</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Мы предлагаем лучшие условия займов с максимальным удобством для клиентов
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Icon name="Clock" className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Быстрое одобрение</h3>
              <p className="text-gray-600">Решение по заявке в течение 5 минут. Деньги на карту сразу после одобрения.</p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Icon name="Shield" className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Безопасность</h3>
              <p className="text-gray-600">Все данные защищены. Проверка через систему ФССП для вашей безопасности.</p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Icon name="Percent" className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Выгодные условия</h3>
              <p className="text-gray-600">Низкие процентные ставки от 1%. Прозрачные условия без скрытых комиссий.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50" id="conditions">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Как получить займ</h2>
            <p className="text-xl text-gray-600">Простой процесс в 4 шага</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: "Calculator", title: "Рассчитайте", desc: "Используйте калькулятор для расчета суммы" },
              { icon: "FileText", title: "Заполните анкету", desc: "Укажите личные данные и загрузите фото" },
              { icon: "CheckCircle", title: "Получите одобрение", desc: "Проверка через ФССП и мгновенное решение" },
              { icon: "CreditCard", title: "Получите деньги", desc: "Средства поступят на вашу карту" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Icon name={step.icon} className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-blue-600 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">{index + 1}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white" id="faq">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Часто задаваемые вопросы</h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left">Какие документы нужны для займа?</AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Для получения займа необходимо предоставить фотографию документа, удостоверяющего личность, указать ФИО и номер телефона. Все данные проверяются через систему ФССП.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left">Как быстро приходят деньги?</AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  После одобрения заявки деньги поступают на карту в течение нескольких минут. В некоторых случаях перевод может занять до 30 минут.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left">Можно ли продлить срок займа?</AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Да, срок займа можно продлить. Для этого обратитесь в личный кабинет или свяжитесь с нашей службой поддержки за день до окончания срока займа.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left">Какие способы погашения займа?</AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Погасить займ можно через банковскую карту, банковский перевод или через платежные системы. Подробную информацию вы найдете в личном кабинете.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white" id="contacts">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-6">Свяжитесь с нами</h2>
              <p className="text-gray-300 mb-8">
                Наша служба поддержки работает 24/7. Мы всегда готовы помочь вам с любыми вопросами.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Icon name="Phone" className="w-6 h-6 text-blue-400 mr-4" />
                  <div>
                    <p className="font-semibold">Телефон горячей линии</p>
                    <p className="text-gray-300">8 800 555-55-55</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Icon name="Mail" className="w-6 h-6 text-blue-400 mr-4" />
                  <div>
                    <p className="font-semibold">Email поддержки</p>
                    <p className="text-gray-300">support@finansexpress.ru</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Icon name="MapPin" className="w-6 h-6 text-blue-400 mr-4" />
                  <div>
                    <p className="font-semibold">Офис</p>
                    <p className="text-gray-300">г. Москва, ул. Примерная, д. 123</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Получить консультацию</CardTitle>
                <CardDescription className="text-gray-300">Оставьте заявку и мы перезвоним вам</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Имя</Label>
                  <Input id="name" placeholder="Ваше имя" className="bg-gray-700 border-gray-600 text-white" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white">Телефон</Label>
                  <Input id="phone" placeholder="+7 (999) 999-99-99" className="bg-gray-700 border-gray-600 text-white" />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Отправить заявку
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ФинансЭкспресс</span>
              </div>
              <p className="text-gray-400 text-sm">
                Микрофинансовая организация, предоставляющая быстрые займы на выгодных условиях.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Услуги</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Калькулятор займов</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Подача заявки</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Личный кабинет</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Продление займа</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Информация</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Условия займов</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Документы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Договоры</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Поддержка</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Часто задаваемые вопросы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Обратная связь</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Техподдержка</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 ФинансЭкспресс. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Application Modal Placeholder */}
      {showApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Подача заявки</CardTitle>
              <CardDescription>Заполните анкету для получения займа</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Здесь будет форма подачи заявки с полями для ФИО, телефона, загрузки фото документа и интеграцией с ФССП.
              </p>
              <div className="flex space-x-2">
                <Button onClick={() => setShowApplication(false)} variant="outline" className="flex-1">
                  Отмена
                </Button>
                <Button className="flex-1">Продолжить</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;