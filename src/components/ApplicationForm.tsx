import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  loanAmount: number;
  loanTotal: number;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ 
  isOpen, 
  onClose, 
  loanAmount, 
  loanTotal 
}) => {
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    phone: '',
    documentPhoto: null as File | null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && step === 1) {
      setIsTimerActive(true);
      setTimeLeft(20);
    }
  }, [isOpen, step]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeLeft]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Введите фамилию';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Введите имя';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!/^\+?[78]\d{10}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Неверный формат телефона';
    }
    if (!formData.documentPhoto) {
      newErrors.documentPhoto = 'Загрузите фото документа';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, documentPhoto: 'Размер файла не должен превышать 5MB' }));
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setErrors(prev => ({ ...prev, documentPhoto: 'Поддерживаются только JPG и PNG файлы' }));
        return;
      }
      setFormData(prev => ({ ...prev, documentPhoto: file }));
      setErrors(prev => ({ ...prev, documentPhoto: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Симуляция проверки через ФССП
    setTimeout(() => {
      setIsLoading(false);
      setIsApproved(true);
      setStep(3);
    }, 3000);
  };

  const handleNext = () => {
    if (step === 1 && timeLeft === 0) {
      setStep(2);
      setIsTimerActive(false);
    }
  };

  const formatTime = (seconds: number) => {
    return `00:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((20 - timeLeft) / 20) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="outline">Шаг {step} из 3</Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" className="w-4 h-4" />
            </Button>
          </div>
          <CardTitle className="text-2xl">
            {step === 1 && "Подтвердите заявку"}
            {step === 2 && "Заполните анкету"}
            {step === 3 && "Результат проверки"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "У вас есть время для подтверждения заявки"}
            {step === 2 && "Укажите ваши данные для идентификации"}
            {step === 3 && "Проверяем ваши данные через систему ФССП"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Step 1: Timer */}
          {step === 1 && (
            <div className="space-y-6 text-center">
              <div className="bg-blue-50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Детали займа</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-600">Сумма займа</div>
                    <div className="text-2xl font-bold text-blue-600">{loanAmount.toLocaleString()} ₽</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">К возврату</div>
                    <div className="text-2xl font-bold text-gray-900">{loanTotal.toLocaleString()} ₽</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Icon name="Timer" className="w-6 h-6 text-blue-600" />
                  <span className="text-lg font-medium">Время на подтверждение:</span>
                </div>
                
                <div className="text-6xl font-bold text-blue-600 font-mono">
                  {formatTime(timeLeft)}
                </div>
                
                <Progress value={progressPercentage} className="w-full h-3" />
                
                {timeLeft > 0 ? (
                  <p className="text-gray-600">
                    Заявка будет автоматически активирована через {timeLeft} секунд
                  </p>
                ) : (
                  <Alert className="border-green-200 bg-green-50">
                    <Icon name="CheckCircle" className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Время истекло! Теперь вы можете продолжить заполнение анкеты.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Button 
                onClick={handleNext}
                disabled={timeLeft > 0}
                className="w-full py-3 text-lg"
                size="lg"
              >
                {timeLeft > 0 ? `Подождите ${timeLeft}с` : 'Заполнить анкету'}
              </Button>
            </div>
          )}

          {/* Step 2: Application Form */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lastName">Фамилия *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Введите фамилию"
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <Label htmlFor="firstName">Имя *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Введите имя"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="middleName">Отчество</Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  placeholder="Введите отчество (необязательно)"
                />
              </div>

              <div>
                <Label htmlFor="phone">Номер телефона *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+7 (999) 999-99-99"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label>Фото документа (паспорт) *</Label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${errors.documentPhoto ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
                    ${formData.documentPhoto ? 'border-green-500 bg-green-50' : ''}
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {formData.documentPhoto ? (
                    <div className="space-y-2">
                      <Icon name="CheckCircle" className="w-8 h-8 text-green-600 mx-auto" />
                      <p className="text-green-700 font-medium">{formData.documentPhoto.name}</p>
                      <p className="text-sm text-gray-600">Нажмите для замены файла</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Icon name="Upload" className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-gray-600">Нажмите для загрузки фото паспорта</p>
                      <p className="text-sm text-gray-500">Поддерживается JPG, PNG до 5MB</p>
                    </div>
                  )}
                </div>
                {errors.documentPhoto && <p className="text-red-500 text-sm mt-1">{errors.documentPhoto}</p>}
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <Icon name="Shield" className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Все данные будут проверены через систему ФССП для обеспечения безопасности.
                </AlertDescription>
              </Alert>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Назад
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Проверяем данные...
                    </>
                  ) : (
                    'Отправить заявку'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Approval Result */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="Loader2" className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold">Проверяем данные через ФССП</h3>
                  <p className="text-gray-600">Это займет несколько секунд...</p>
                  <Progress value={66} className="w-full h-3" />
                </div>
              ) : isApproved ? (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="CheckCircle" className="w-12 h-12 text-green-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Заявка одобрена!</h3>
                    <p className="text-gray-600">Деньги будут переведены на вашу карту в течение 5 минут</p>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Детали займа:</h4>
                    <div className="space-y-2 text-left">
                      <div className="flex justify-between">
                        <span>Сумма займа:</span>
                        <span className="font-semibold">{loanAmount.toLocaleString()} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Проценты (1%):</span>
                        <span className="font-semibold">{(loanAmount * 0.01).toLocaleString()} ₽</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span>К возврату:</span>
                        <span className="font-bold text-green-600">{loanTotal.toLocaleString()} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Срок возврата:</span>
                        <span className="font-semibold">30 дней</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full py-3 text-lg bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      // Redirect to personal cabinet
                      alert('Переход в личный кабинет...');
                      onClose();
                    }}
                  >
                    Перейти в личный кабинет
                  </Button>

                  <p className="text-sm text-gray-500">
                    Данные для входа отправлены на указанный номер телефона
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="XCircle" className="w-12 h-12 text-red-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-red-600 mb-2">Заявка отклонена</h3>
                    <p className="text-gray-600">К сожалению, вы не прошли проверку в системе ФССП</p>
                  </div>

                  <Button variant="outline" onClick={onClose} className="w-full">
                    Закрыть
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationForm;