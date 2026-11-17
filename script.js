/* Language switcher; English HTML remains available when JavaScript is disabled. */
const translations = {"navExperience":"Опыт","navContact":"Контакты","introKicker":"DATABASE ENGINEER / POSTGRESQL","introSummary":"Работаю с производительностью и надёжностью production-баз данных. Основной фокус — PostgreSQL: SQL-нагрузка, физическая организация данных, репликация и разбор сложных инцидентов.","introDetails":"SQL & performance · Data modeling · Replication · Reliability","experienceTitle":"Опыт работы","toolsLabel":"Технологии и инструменты","contactTitle":"Контакты","contactText":"Для профессиональных вопросов и обсуждения PostgreSQL и систем баз данных.","contactLink":"Профиль LinkedIn ↗","footerNote":"Senior Database Engineer · PostgreSQL","mobileMenu":"Открыть меню","item0_0":"Эксплуатация и сопровождение высоконагруженных кластеров баз данных в production, обеспечение их доступности, производительности и отказоустойчивости.","item0_1":"Проведение массовых обновлений инфраструктуры баз данных, включая операционные системы, СУБД, прокси-сервисы, компоненты мониторинга и конфигурации.","item0_2":"Диагностика и устранение проблем при инфраструктурных изменениях, включая особенности устаревших инсталляций и разнородных окружений.","item0_3":"Анализ производительности баз данных, выявление ресурсоёмких запросов, узких мест и причин деградации под нагрузкой.","item0_4":"Оптимизация SQL-запросов, индексных структур и моделей данных с учётом фактического профиля нагрузки.","item0_5":"Работа с механизмами репликации, отказоустойчивости и аварийного переключения. Проработка изменений архитектуры кластеров.","item0_6":"Расследование production-инцидентов, анализ первопричин и устранение проблем, влияющих на доступность и стабильность сервисов.","item0_7":"Мониторинг состояния кластеров, анализ эксплуатационных метрик и сопровождение компонентов наблюдаемости.","item0_8":"Выполнение инфраструктурных изменений с использованием Ansible и AWX, диагностика ошибок автоматизации и сопровождение конфигураций.","item0_9":"Техническая поддержка команд разработки и внутренних клиентов, диагностика проблем взаимодействия приложений с базами данных.","date0":"Август 2026 — настоящее время","company1":"Сбер","item1_0":"Миграция крупной высоконагруженной системы с Oracle на PostgreSQL, последующая оптимизация производительности и надёжности.","item1_1":"Комплексный анализ производительности PostgreSQL, профилирование нагрузки, выявление системных узких мест и избыточного потребления ресурсов.","item1_2":"Оптимизация сложных SQL-запросов и планов выполнения. Ускорение критичных запросов на порядки.","item1_3":"Проектирование физических моделей данных PostgreSQL и индексных стратегий с учётом профиля чтения, записи и обновления.","item1_4":"Оптимизация физического хранения данных и индексов. Сокращение объёма с 20 до 10 ТБ, определение потенциала дальнейшего снижения.","item1_5":"Проектирование распределения данных в Greenplum для локального выполнения соединений и минимизации межсегментных передач данных.","item1_6":"Разработка механизма параллельной начальной загрузки для логической репликации PostgreSQL. Перенос 10 ТБ за 10 часов.","item1_7":"Разработка инструмента сверки больших объёмов данных между источником и приёмником с выявлением расхождений и накопленных ошибок CDC.","item1_8":"Разработка облегчённого механизма обеспечения уникальности в партиционированных таблицах Pangolin без использования глобальных индексов.","item1_9":"Диагностика критических производственных инцидентов PostgreSQL, расследование первопричин и устранение проблем производительности и надёжности.","item1_10":"Архитектурная экспертиза решений PostgreSQL и Greenplum, ревью SQL и моделей данных, техническое консультирование архитекторов, технических лидеров и разработчиков.","item1_11":"Проведение технических воркшопов по СУБД и оптимизации работы с базами данных.","date1":"Июль 2023 — август 2026","item2_0":"Администрирование более 300 кластеров PostgreSQL в тестовых и production-средах.","item2_1":"Анализ производительности PostgreSQL и оптимизация SQL-нагрузки критически важных бизнес-систем.","item2_2":"Планирование ёмкости, анализ production-инцидентов и консультирование команд разработки по проектированию баз данных.","date2":"Май 2020 — июнь 2023","item3_0":"Разработка инструмента автоматизации DDL-миграций между несколькими средами.","item3_1":"Проектирование и сопровождение кластеров Apache Cassandra, автоматизация проверки согласованности данных и работа с логической репликацией PostgreSQL.","date3":"Декабрь 2018 — май 2020","item4_0":"Проектирование и внедрение multi-master-топологии логической репликации PostgreSQL на базе pglogical.","item4_1":"Сопровождение отказоустойчивых кластеров PostgreSQL и процедур Disaster Recovery; администрирование 15-узлового кластера Apache HBase.","date4":"Июль 2017 — декабрь 2018","item5_0":"Администрирование PostgreSQL в production, анализ планов выполнения SQL и диагностика проблем производительности.","item5_1":"Разработка механизмов разграничения доступа PostgreSQL для решений на Astra Linux.","date5":"Февраль 2014 — июль 2017"};
const defaultText = new Map();
document.querySelectorAll('[data-i]').forEach(el => defaultText.set(el.dataset.i, el.textContent));
let lang = 'en';
try { if (localStorage.getItem('portfolio-language') === 'ru') lang = 'ru'; } catch (_) {}
function applyLanguage(next) {
  lang = next;
  document.documentElement.lang = next;
  document.querySelectorAll('[data-i]').forEach(el => {
    const key = el.dataset.i;
    el.textContent = next === 'ru' ? (translations[key] ?? defaultText.get(key)) : defaultText.get(key);
  });
  const button = document.getElementById('lang');
  button.textContent = next === 'ru' ? 'EN' : 'RU';
  button.setAttribute('aria-label', next === 'ru' ? 'Switch to English' : 'Переключить на русский');
  try { localStorage.setItem('portfolio-language',next); } catch (_) {}
}
document.getElementById('lang').addEventListener('click',()=>applyLanguage(lang==='en'?'ru':'en'));
applyLanguage(lang);
const menu = document.getElementById('menu');
const nav = document.getElementById('navigation');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menu.setAttribute('aria-expanded',String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menu.setAttribute('aria-expanded','false');
}));
const photo=document.getElementById('profile');
photo.addEventListener('error',()=>photo.classList.add('failed'));
if(photo.complete && !photo.naturalWidth) photo.classList.add('failed');
document.getElementById('year').textContent = new Date().getFullYear();
