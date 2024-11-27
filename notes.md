- Łatwiej jest oceniać treść niż generować
- Wiele modeli nie radzi sobie z wykonywaniem zadań, których treść jest w formacie innym niż naturalny język (yaml, json)
Lepiej jest yrozbi zadanie na transformacje danych, a następnie ich ocenę/odpowiedź
- W prompcie oceniającym bardzo wskazane jest dodanie przestrzeni na "zastanowienie się". Możemy to zrobić albo poprzez oczekiwanie formatu JSON, albo poprzez format widoczny poniżej. Polega on na zastosowaniu tagów `<thinking>` oraz `<result>`, w których model może wpisać oczekiwaną treść, a następnie z pomocą wyrażenia regularnego możemy pobrać rezultat. W bloku `<thinking>` model generując uzasadnienie, stopniowo zwiększa prawdopodobieństwo tego, że kolejne tokeny będą wygenerowane zgodnie z naszymi zasadami. Ważne tu jest dodawanie przykładów z blokiem `<thinking>` aby "pokazać" modelowi jak ma myśleć.

Meta Prompt - szablon dla LLMu, któy będzie generował prompty
Służy do generowania promptów wspólnie z twórcą, ocenie, ewaluacji i obserwacji modelu
- LLMy mają w zwyczaju skupiać się najbardziej na początku i końcu instrukcji, dlatego precyzyjny `<objective>` jest kluczowy
- Określanie zasad. Nie wiadomo czy pisanie słów kluczowych wielkimi literami jest pomocne, ale na pewno sprawia, że instrukcja jest bardziej czytelna
    - Aktywowanie różnych obszarów modelu
        - wymaganie opisu "Chain of thought"
- zasady komponowania promptu
- rady dotyczący pisaniapromptu, np. modele mentalne, unikanie błędów poznawczych
- przykład - szablon promptu prezentujący jego strukturę

Optymalizacja aplikacji:
- Jak możemy zaprojektować logikę, aby realizować jak najwięcej zapytań równolegle?
- Czy możemy skorzystać z mniejszego, szybszego modelu, nawet kosztem bardziej obszernych promptów?
- Czy możemy skorzystać z mechanizmu cache'owania promptu w celu zmniejszenia czasu reakcji (np. w przypadku modeli Anthropic)?
- Czy możemy skorzystać z platform oferujących szybką inferencję?
- Czy w ogóle będzie zależało nam na wydajności, bo np. część z zadań mo
- Czy wszystkie z zadań musi realizować model i czy możemy przynajmniej część logiki, przenieść na kod (np. przez wyrażenia regularne)?
- Kompresja promptów - umiarkowanie przydatna w kontekście oszczędności tokenów (context window stale rosną), ale mogą zapobiec gubieniu rozkojarzaniu się modelu i gubieniu instrukcji
    - sam model może zaproponować jak prompt może być uproszczony
- tokeny wyjściowe kosztują z reguły więcej niż tokeny wejściowe
    - chcemy dążyć do jak najkrótszych wypowiedzi modelu

Fine tuning - proces optymalizacji modelu, w którym zezwalamy modelowi na halucynowanie, ale w narzucony sposób
- uczymy model z własnych danych
- można to zrobić w openAI dashboard w strukturze JSONL
```JSONL
{
    "messages": [
        {
            "role": "system",
            "content": "Klasyfikuj temat maila"
        },
        {
            "role": "user",
            "content": "Faktura nr 1234"
        },
        {
            "role": "assistant",
            "content": "rachunek"
        }
    ]
}
{...}
{...}
```

Dane testowe do optymalizacji promptu i systemu
- promptFoo - narzędznie do ewaluacji promptów
- warto mieszać dane syntetyczne i "prawdziwe", które biorą pod uwagę slang, błędy językowe itd.
- używanie danych produkcyjnych - agregowanie, anonimizacja, pseudonimizacja celem zachowania prywatności
- automatyczna ewaluacja w czasie rzeczywistym - natychmiastowa reakcja na błędy
    - wymaga monitorowania 
    - alertowanie
    - monitorowanie musi być optymalizowane, aby jak najszybciej wykrywać błędy
        - strumieniowanie, np. kafka
        - monitorowanie anomalii
            - nietypowe zapytania, itd
            - triggery na podstawie metryk ewaluacyjnych - zintegrowane jako np. webhook
- ewaluacja i testowanie przygotowuje model na niespodziewane wydarzenia w środkowisku produkcyjnym

Aplikacje produkcyjne
- wyszukiwarki w formie baz wektorowych
    - Dane w bazie wektorowej przechowywane są w formie embeddingu oraz powiązanych z nimi metadanych. Embedding generowany jest przez model i wybranego modelu nie można zastąpić innym bez ponownego indeksowania całej bazy. 
    - modele generujące embedding mają różną skutecznośc w zależności od języka
    - warto w związku z tym stosować kilka sposobów opisywania danych. jednak to utrudnia akutalizację, wyszukiwanie i synchronizację danych
- warto tworzyć warstwę abstrakcji, która pozwala na korzystanie z kilku różnych modeli

## Przetwarzanie audio
- dane wejeściowe nie mogą być zbyt długie: możliwe, że plik audio trzeba skompresować lub podzielić na części
- fragmenty ciszy są błędnie interprettowane, i często model odpowiada zdaniami takimi jak "Dziękuję za uwagę" - warto unikać takich fargmentów [Whisper speech to text]
- text to speech: nadal dużym wyzwaniem pozostaje przetwarzanie istniejących treści, takich jak tłumaczenie filmów, ze względu na potrzebę synchronizacji dźwięku z oryginalną ścieżką
- text to speech nadal niemożliwe jest wpływanie na intonację czy sposób wymowy
- format `wav` pozwala na dzielenie nagrania na części, istnieje także `.ogg`, który dzięki kompresji pozwoliłby nam na zmniejszenie rozmiaru przesyłanych danych
- praca z modelem `Whisper` - kluczowe jest dzielenie nagrania na fragmenty
- warto poda wiadomość systemową modelowi z szerszym kontekstem, tak aby poprawnie interpretował wiadomości głosowe

nagrywanie dźwięku
- jakość audio: możliwość zweryfikowanie nagranego dźwięku przez użytkownika
- cisza: dynamiczne wykrywanie ciszy - wówczas nagranie jest zatrzymywane. Technika te może być również wykorzystana do przerwania wypowiedzi aystenta
- kontekst: ważne jest uzwględnienie słów kluczowych w transkrypcji
- potwierdzenie: elementy pozwalające na potwierdzenie wykonania akcji, np. przycisk lub komenda głosowa
- korekta: możliwość poprawy transkrypcji przez model w celu poprawienia formatowania i błędów

optymalizacja generowanego dźwieku
- możliwość przełączenia się na `groq` i skorzystanie z usługi EvlevenLabs z modelem "turbo"
  - szybszy czas reakcji
- zmiana formatu dźwięku z `.wav` na `.ogg` - pozwala na zmniejszenie rozmiaru pliku
- zastosowanie strumieniowania
- zwracanie odpowiedzi fragmentami do modelu Text-to-Speech, który umoliwia strumieniowanie generowanego nagrania
  - redukowanie czasu reakcji
- równoległe wykonywanie akcji, które nie są zależne od siebie
- zastosowanie mniejszych modeli i/lub korzystanie z platform oferujących szybką inferencję
- skrócenie wypowiedzi modelu
- Zastosowanie platform takich jak Hume.ai czy Bland.ai w sytuacji gdy zależy nam na budowaniu interfejsów umożliwiających rozmowy z LLM

## Przetwarzanie obrazu
Z użyciem algorytmów, bez AI:
1. Wykrywanie krawędzi obrazu
2. Wykrywanie ruchu - identyfikacja zmian pomiędzy kolejnymi klatkami
3. Znajdowanie konturów - liczenie obiektów na obrazie, np ludzie w sklepie

rozmycie - gaussian blur pomaga w lepszym wykrywaniu krawędzi
słabe oświetlenie - poprawianie wartości progowych celem redukcji szumu
niższa rozdzielczość - szybsza praca algorytmów

złożone zadania wymagające "zrozumienia" obrazu: algorytmy przatwarzania obrazu mogą być niewystarczające

techniki promptowania takie jak `Few-Shot`, `Chain of Thought` czy `Self-Consistency` mogą również być używane z VLM

można wykorzystywać zwroty takie jak:
- you have perfect vision
- take a closer look
zwiększają one szanse na to, że zadanie zostanie zrealizowane poprawnie

- oznaczenie treści, wykadrowanie obrazu ma znaczenie dla odpopwiedzi modelu
  - np. obramowanie istotnych elementów na obrazie
- dostarczając kontekst do zapytania, można również użyć kolejnego obrazu, nie tylko tekstu
  - kontekst - np. opis osoby, którą należy znaleźć na obrazku
  - potencjalny case - klasyfikacja obrazów

Ograniczenia VLM (Visual Language Model):
- trudność z rozpoznawaniem przecinających się kształtów
- problemy ze zdolnością do poruszania się po szachownicy
- rozpoznawanie kolorów ze zwróceniem faktycznej palety, np. HEX - lepsze tu są metody programistyczne
- określenie rozmiaru obrazka, odległości między obiektami, czy ich dokładnej lokalizacji
- nieumiejetność rozpoznawania rzeczy, które wychodzą poza bazę wiedzy modelu
- wrażliwe na prompt injection - wstrzykiwanie złośliwych danych w celu zmanipulowania modelu
- mimo ogólnie dobrego rozpoznawania tesktu, zdarzają się rażące błędy
- dwuznaczność zapytania obniża jakość wypowiedzi
- publiczne VLM są ograniczane pod kątem możliwości rozpoznawania znanych osób

Obecnie warto patrzeć na VLM jako narzędzie do **ogólnego zrozumienia obrazów** z pominięciem szczegółów

Open Source - model Mistral dostępny przez API i na Hugging Face

## Generowanie i modyfikacja obrazów

- im bardziej złożony prompt, tym mniejsze prawdopodobieństwo, że model zwróci obraz zgodny z oczekiwaniami

API do generowania obrazów:
- Leonardo.ai
- Replicate

Midjourney
- bardzo dobra jakość, ale niska sterowność
- brak oficjalnego API (wrappery mogą doprowadzić do zablokowania konta)

- przydatne jest posługiwanie się szablonami do generowania obrazów
  - przydatne w marketingu do generowania reklam, okładek arykułów bloga/neswlettera
- prompty mogą zawierać zarówno instrukcje tekstowe jak i grafiki referencyjne
  - pozwala na zachowanie spójności stylu

ComfyUI
- interfejs do sterowania meta promptami, nadawnia stylu, stosowania obrazów referencyjnych

inne metody manipulacji obrazów, które mogą być używane z VLM:
- zwiększenie skali obrazu z ograniczonym zachowaniem detali'\
- zwiększanie skali z powiększeniem kadru
- automatyczne usuwanie tłą, uwzględniając włosy, krople, cienie, itd.
- usuwanie wybranych elementów ze zdjęć, zamianę oraz łączenie kilku zdjęć
- generowanie spójnych obrazów, zgodnych z brandingiem
- wykorzystanie istniejących grafik do automatycznego generowania wielu formatów
- wizualizacje na podstawie grafik referencyjnych
- animacje grafik do wideo

prompt
- raczej słowa kluczowe i flagi sterujące ustawieniami niż pełne instrukcje
  - shiny, dark, warm weather, natural lighting, itd.
- rekomendacja midjourney: krótkie prompty, minimum informacji opsiujących oczekiwany wynik
  - nie zawsze jest to prawda
- można wykorzystać model do przeredagowania promptu na bardziej precyzyjny
- wykorzystywanie placeholderów pzy reużywaniu promptu do generowania nowych grafik z np. innymi postaciami, ale w tym samym stylu

## Połączenie wielu formatów

### generowanie treści
  - dobrzre sprawdza się podsumowanie treści
stosowanie modelu mentalnego
- First-principles Thinking - a method of problem-solving that involves breaking down complex issues into their most basic and fundamental parts.

- modele obecnie mają trudności z wykonywaniem złożonych zadań w ramach jednego zapytania. Skupienie na jednej aktywności może podnieść skutecznośc do nawet 100%
- przetwarzany tekst może byc analizwoany wielokrotnie po różnym kątem. Pozwala to na zgromadzenie wysokiej jakości kontekstu, na podstawie którego można wykonać zadanie
- warto rozważyc kroki, w których generowana treść jest poddawana krytyce lub weryfikacji pod kątem naszych wymagań. Pozwala to wyeliminować błędy
- finalne podsumowanie - docelowa struktura oraz komplet informacji. Warto dodatkowo zwrócić uwagę na stylizację treści, gdyż modele stosują domyślnie mało precyzyjny styl wypowiedzi
- wymieione kroki nie muszą być wykonywane przez jeden model, wskazane jest łączenie różnych modeli - od mniejszych, tańszych do tych większych

### opisywanie obrazu
- model nie może podejrzeć linku z obrazem, dlatego należy go pobrać i przesłać w formie base64
- podobnie jak w podsumowanie tekstu, potrzebny jest dodatkowy kontekst do wygenerowania wartościowego opisu
  - podgląd obrazu, treść, która go otacza

### analiza materiałów wideo
- dostępna w modelu gemini 1.5 pro
- opisywanie wideo jest podobne do pisywania obrazów
- należy jednak zwrócić uwagę na liczbę tokenóœ, która dla jednominutowego materiału wynosci 18 000

model gemini oferuje możliwość wykorzystania pamięci podręcznej dla kontekstu, co dla wielokrotnego przerwarzania plików audio/wideo jest koniecznością

### "autononiczna" współpraca modelów
- obecnie łączenie modeli może być drogie (szczególnie tworzenie dźwięków - na ten moment potrzeba kilku modeli), 
- obecnie jakość modeli text to audio jest niska
- jednak w przyszłości zadanie to będzie prawdopodobnie o wiele prostsze z pomocą modeli multimodalnych, które są zdolen do generowanie dźwieku

mixture of agents - modele open source współpracujące ze sobą, które są ws tanie osiągnąc lepsze rezultaty niż gpt-4o

## Multimodalność

- zamiana tekstu na formę audio - obiwązują limity danych wejściowych oraz wyjściowych
- stworzenie promptu, który poradzi sobie z dopasowaniem stylu wypowiedzi
  - prompt nie powinien wskazywać na generowanie treści na podstawie obecnej, lecz na jej transformację wg określonych zasad
    - to pozwala na zachowanie spójności stylu
- warto zwrócić uwagę na to, aby model zadbał o poprawną odmianę słów jeśli transformumemy tekst, który jest po polsku

### Kontekst
- klasyfikacja danych wejściowych
  - przykład tworzenia notatek na podstawie nagrania audio - przypisanie kategorii pozwala na ustalenie kontekstu i np. zastosowanir odpowiedniego formatowania notatki
  - notatki na podstawie obrazu - nadawanie kontekstu na podsatwie danych pochodząych z urządzenia, które utworzyło notatkę (np. lokalizacja, inne metadane)

## Dokumenty

- limity wynikajce z okna kontekstowego
  - dzielenie materiału wejściowego na fragmenty - chunking. 
  - ważne wówczas jest utzrymanie uwagi modelu na kontekście
    - podążanie za instrukcjami, rozumienie treści - jest to wciąż wyzwaniem dla modeli

**Dokument** to obiekt składający się z głównej treści oraz metadanych, które opisują jego cechy i nadają kontekst. 
W kontekście LLM zwykle jest to mały fragment dłuższej treści z zewnętrznego źródła, 
który dodajemy do indeksów silników wyszukiwania na potrzeby Retrieval-Augmented Generation lub innych scenariuszy wymagających odnalezienia konkretnych zestawów informacji.

struktura metadanych:
- info nt. żródła i dokumentów sąsiadujących
- info pozwalające nakreślić kontekst (np. z jakiego pliku pochodzi dokument)
- info pozwalające skutecznie filtrować dokumenty (data, rola, uprawnienia czy kategoria)
- info pozwalające na kompresję treści dokumentu (np.linki)

Zatem warto myśleć o dokumentach tak, że gdy budujemy je na podstawie jakiegoś pliku czy bazy danych,
to musimy wygenerować je tak, aby model posiadał wystarczający kontekst na ich temat oraz aby silnik wyszukiwania mógł skutecznie do nich dotrzeć

generowanie treści dokumentów:
- text splitting
- generowane przez model lub człowieka
- LangChain: dzielenie na podstawie długości lub kolejnych znaków specjalnych 
- recursive text splitting, dzielenie po akapitach, podwójnej linii, nowej linii, kropce, wykrzykniku, itd.
  - mniejsze prawdopodobieństwo zgubienia kontekstu
- techniki te przeciętnie się sprawdzają w praktyce
- Ponoć zastosowanie "overlap" bywa skuteczne (nakładanie na siebie sporej częsci dokumentuów, np. 50%)

sugestia anthropic celem utzrymania okontesktu dokumentów
- każdy dokument należy przeprocesować przez LLM i prompt, który nada mu kontekts na podstawie całego dokumentu
  - cache'owanie promptów jest tutaj istotne
  - zastosowanie gemini pozwoli przetworzyć duże zestawy danych 

### Nieustrukturyzowane dane

- techniki podobne jak w multimodalności; połączeniu wielu formatów

### Kategoryzacja i filtrowanie

- wyszukiwanie wygenerowanych dokumentów na podstawie zbliżonego opisu
  - ograniczanie liczby zwracanych wyników
  - precyzyjne zapytanie celujące w konkretne dokumenty daje wyższą skuteczność, o ile opisy narzędzi są wystarczająco dobre
  - nieprecyzyjne zapytanie - gorsza skuteczność + ograniczenie liczby wyników
- ważne są kategorie i tagi, które pomagają w przypadku nieprecyzyjnych zapytań