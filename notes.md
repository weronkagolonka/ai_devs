-   Łatwiej jest oceniać treść niż generować
-   Wiele modeli nie radzi sobie z wykonywaniem zadań, których treść jest w formacie innym niż naturalny język (yaml, json)
    Lepiej jest yrozbi zadanie na transformacje danych, a następnie ich ocenę/odpowiedź
-   W prompcie oceniającym bardzo wskazane jest dodanie przestrzeni na "zastanowienie się". Możemy to zrobić albo poprzez oczekiwanie formatu JSON, albo poprzez format widoczny poniżej. Polega on na zastosowaniu tagów `<thinking>` oraz `<result>`, w których model może wpisać oczekiwaną treść, a następnie z pomocą wyrażenia regularnego możemy pobrać rezultat. W bloku `<thinking>` model generując uzasadnienie, stopniowo zwiększa prawdopodobieństwo tego, że kolejne tokeny będą wygenerowane zgodnie z naszymi zasadami. Ważne tu jest dodawanie przykładów z blokiem `<thinking>` aby "pokazać" modelowi jak ma myśleć.

Meta Prompt - szablon dla LLMu, któy będzie generował prompty
Służy do generowania promptów wspólnie z twórcą, ocenie, ewaluacji i obserwacji modelu

-   LLMy mają w zwyczaju skupiać się najbardziej na początku i końcu instrukcji, dlatego precyzyjny `<objective>` jest kluczowy
-   Określanie zasad. Nie wiadomo czy pisanie słów kluczowych wielkimi literami jest pomocne, ale na pewno sprawia, że instrukcja jest bardziej czytelna
    -   Aktywowanie różnych obszarów modelu
        -   wymaganie opisu "Chain of thought"
-   zasady komponowania promptu
-   rady dotyczący pisaniapromptu, np. modele mentalne, unikanie błędów poznawczych
-   przykład - szablon promptu prezentujący jego strukturę

Optymalizacja aplikacji:

-   Jak możemy zaprojektować logikę, aby realizować jak najwięcej zapytań równolegle?
-   Czy możemy skorzystać z mniejszego, szybszego modelu, nawet kosztem bardziej obszernych promptów?
-   Czy możemy skorzystać z mechanizmu cache'owania promptu w celu zmniejszenia czasu reakcji (np. w przypadku modeli Anthropic)?
-   Czy możemy skorzystać z platform oferujących szybką inferencję?
-   Czy w ogóle będzie zależało nam na wydajności, bo np. część z zadań mo
-   Czy wszystkie z zadań musi realizować model i czy możemy przynajmniej część logiki, przenieść na kod (np. przez wyrażenia regularne)?
-   Kompresja promptów - umiarkowanie przydatna w kontekście oszczędności tokenów (context window stale rosną), ale mogą zapobiec gubieniu rozkojarzaniu się modelu i gubieniu instrukcji
    -   sam model może zaproponować jak prompt może być uproszczony
-   tokeny wyjściowe kosztują z reguły więcej niż tokeny wejściowe
    -   chcemy dążyć do jak najkrótszych wypowiedzi modelu

Fine tuning - proces optymalizacji modelu, w którym zezwalamy modelowi na halucynowanie, ale w narzucony sposób

-   uczymy model z własnych danych
-   można to zrobić w openAI dashboard w strukturze JSONL

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

-   promptFoo - narzędznie do ewaluacji promptów
-   warto mieszać dane syntetyczne i "prawdziwe", które biorą pod uwagę slang, błędy językowe itd.
-   używanie danych produkcyjnych - agregowanie, anonimizacja, pseudonimizacja celem zachowania prywatności
-   automatyczna ewaluacja w czasie rzeczywistym - natychmiastowa reakcja na błędy
    -   wymaga monitorowania
    -   alertowanie
    -   monitorowanie musi być optymalizowane, aby jak najszybciej wykrywać błędy
        -   strumieniowanie, np. kafka
        -   monitorowanie anomalii
            -   nietypowe zapytania, itd
            -   triggery na podstawie metryk ewaluacyjnych - zintegrowane jako np. webhook
-   ewaluacja i testowanie przygotowuje model na niespodziewane wydarzenia w środkowisku produkcyjnym

Aplikacje produkcyjne

-   wyszukiwarki w formie baz wektorowych
    -   Dane w bazie wektorowej przechowywane są w formie embeddingu oraz powiązanych z nimi metadanych. Embedding generowany jest przez model i wybranego modelu nie można zastąpić innym bez ponownego indeksowania całej bazy.
    -   modele generujące embedding mają różną skutecznośc w zależności od języka
    -   warto w związku z tym stosować kilka sposobów opisywania danych. jednak to utrudnia akutalizację, wyszukiwanie i synchronizację danych
-   warto tworzyć warstwę abstrakcji, która pozwala na korzystanie z kilku różnych modeli

## Przetwarzanie audio

-   dane wejeściowe nie mogą być zbyt długie: możliwe, że plik audio trzeba skompresować lub podzielić na części
-   fragmenty ciszy są błędnie interprettowane, i często model odpowiada zdaniami takimi jak "Dziękuję za uwagę" - warto unikać takich fargmentów [Whisper speech to text]
-   text to speech: nadal dużym wyzwaniem pozostaje przetwarzanie istniejących treści, takich jak tłumaczenie filmów, ze względu na potrzebę synchronizacji dźwięku z oryginalną ścieżką
-   text to speech nadal niemożliwe jest wpływanie na intonację czy sposób wymowy
-   format `wav` pozwala na dzielenie nagrania na części, istnieje także `.ogg`, który dzięki kompresji pozwoliłby nam na zmniejszenie rozmiaru przesyłanych danych
-   praca z modelem `Whisper` - kluczowe jest dzielenie nagrania na fragmenty
-   warto poda wiadomość systemową modelowi z szerszym kontekstem, tak aby poprawnie interpretował wiadomości głosowe

nagrywanie dźwięku

-   jakość audio: możliwość zweryfikowanie nagranego dźwięku przez użytkownika
-   cisza: dynamiczne wykrywanie ciszy - wówczas nagranie jest zatrzymywane. Technika te może być również wykorzystana do przerwania wypowiedzi aystenta
-   kontekst: ważne jest uzwględnienie słów kluczowych w transkrypcji
-   potwierdzenie: elementy pozwalające na potwierdzenie wykonania akcji, np. przycisk lub komenda głosowa
-   korekta: możliwość poprawy transkrypcji przez model w celu poprawienia formatowania i błędów

optymalizacja generowanego dźwieku

-   możliwość przełączenia się na `groq` i skorzystanie z usługi EvlevenLabs z modelem "turbo"
    -   szybszy czas reakcji
-   zmiana formatu dźwięku z `.wav` na `.ogg` - pozwala na zmniejszenie rozmiaru pliku
-   zastosowanie strumieniowania
-   zwracanie odpowiedzi fragmentami do modelu Text-to-Speech, który umoliwia strumieniowanie generowanego nagrania
    -   redukowanie czasu reakcji
-   równoległe wykonywanie akcji, które nie są zależne od siebie
-   zastosowanie mniejszych modeli i/lub korzystanie z platform oferujących szybką inferencję
-   skrócenie wypowiedzi modelu
-   Zastosowanie platform takich jak Hume.ai czy Bland.ai w sytuacji gdy zależy nam na budowaniu interfejsów umożliwiających rozmowy z LLM

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

-   you have perfect vision
-   take a closer look
    zwiększają one szanse na to, że zadanie zostanie zrealizowane poprawnie

-   oznaczenie treści, wykadrowanie obrazu ma znaczenie dla odpopwiedzi modelu
    -   np. obramowanie istotnych elementów na obrazie
-   dostarczając kontekst do zapytania, można również użyć kolejnego obrazu, nie tylko tekstu
    -   kontekst - np. opis osoby, którą należy znaleźć na obrazku
    -   potencjalny case - klasyfikacja obrazów

Ograniczenia VLM (Visual Language Model):

-   trudność z rozpoznawaniem przecinających się kształtów
-   problemy ze zdolnością do poruszania się po szachownicy
-   rozpoznawanie kolorów ze zwróceniem faktycznej palety, np. HEX - lepsze tu są metody programistyczne
-   określenie rozmiaru obrazka, odległości między obiektami, czy ich dokładnej lokalizacji
-   nieumiejetność rozpoznawania rzeczy, które wychodzą poza bazę wiedzy modelu
-   wrażliwe na prompt injection - wstrzykiwanie złośliwych danych w celu zmanipulowania modelu
-   mimo ogólnie dobrego rozpoznawania tesktu, zdarzają się rażące błędy
-   dwuznaczność zapytania obniża jakość wypowiedzi
-   publiczne VLM są ograniczane pod kątem możliwości rozpoznawania znanych osób

Obecnie warto patrzeć na VLM jako narzędzie do **ogólnego zrozumienia obrazów** z pominięciem szczegółów

Open Source - model Mistral dostępny przez API i na Hugging Face

## Generowanie i modyfikacja obrazów

-   im bardziej złożony prompt, tym mniejsze prawdopodobieństwo, że model zwróci obraz zgodny z oczekiwaniami

API do generowania obrazów:

-   Leonardo.ai
-   Replicate

Midjourney

-   bardzo dobra jakość, ale niska sterowność
-   brak oficjalnego API (wrappery mogą doprowadzić do zablokowania konta)

-   przydatne jest posługiwanie się szablonami do generowania obrazów
    -   przydatne w marketingu do generowania reklam, okładek arykułów bloga/neswlettera
-   prompty mogą zawierać zarówno instrukcje tekstowe jak i grafiki referencyjne
    -   pozwala na zachowanie spójności stylu

ComfyUI

-   interfejs do sterowania meta promptami, nadawnia stylu, stosowania obrazów referencyjnych

inne metody manipulacji obrazów, które mogą być używane z VLM:

-   zwiększenie skali obrazu z ograniczonym zachowaniem detali'\
-   zwiększanie skali z powiększeniem kadru
-   automatyczne usuwanie tłą, uwzględniając włosy, krople, cienie, itd.
-   usuwanie wybranych elementów ze zdjęć, zamianę oraz łączenie kilku zdjęć
-   generowanie spójnych obrazów, zgodnych z brandingiem
-   wykorzystanie istniejących grafik do automatycznego generowania wielu formatów
-   wizualizacje na podstawie grafik referencyjnych
-   animacje grafik do wideo

prompt

-   raczej słowa kluczowe i flagi sterujące ustawieniami niż pełne instrukcje
    -   shiny, dark, warm weather, natural lighting, itd.
-   rekomendacja midjourney: krótkie prompty, minimum informacji opsiujących oczekiwany wynik
    -   nie zawsze jest to prawda
-   można wykorzystać model do przeredagowania promptu na bardziej precyzyjny
-   wykorzystywanie placeholderów pzy reużywaniu promptu do generowania nowych grafik z np. innymi postaciami, ale w tym samym stylu

## Połączenie wielu formatów

### generowanie treści

-   dobrzre sprawdza się podsumowanie treści
    stosowanie modelu mentalnego
-   First-principles Thinking - a method of problem-solving that involves breaking down complex issues into their most basic and fundamental parts.

-   modele obecnie mają trudności z wykonywaniem złożonych zadań w ramach jednego zapytania. Skupienie na jednej aktywności może podnieść skutecznośc do nawet 100%
-   przetwarzany tekst może byc analizwoany wielokrotnie po różnym kątem. Pozwala to na zgromadzenie wysokiej jakości kontekstu, na podstawie którego można wykonać zadanie
-   warto rozważyc kroki, w których generowana treść jest poddawana krytyce lub weryfikacji pod kątem naszych wymagań. Pozwala to wyeliminować błędy
-   finalne podsumowanie - docelowa struktura oraz komplet informacji. Warto dodatkowo zwrócić uwagę na stylizację treści, gdyż modele stosują domyślnie mało precyzyjny styl wypowiedzi
-   wymieione kroki nie muszą być wykonywane przez jeden model, wskazane jest łączenie różnych modeli - od mniejszych, tańszych do tych większych

### opisywanie obrazu

-   model nie może podejrzeć linku z obrazem, dlatego należy go pobrać i przesłać w formie base64
-   podobnie jak w podsumowanie tekstu, potrzebny jest dodatkowy kontekst do wygenerowania wartościowego opisu
    -   podgląd obrazu, treść, która go otacza

### analiza materiałów wideo

-   dostępna w modelu gemini 1.5 pro
-   opisywanie wideo jest podobne do pisywania obrazów
-   należy jednak zwrócić uwagę na liczbę tokenóœ, która dla jednominutowego materiału wynosci 18 000

model gemini oferuje możliwość wykorzystania pamięci podręcznej dla kontekstu, co dla wielokrotnego przerwarzania plików audio/wideo jest koniecznością

### "autononiczna" współpraca modelów

-   obecnie łączenie modeli może być drogie (szczególnie tworzenie dźwięków - na ten moment potrzeba kilku modeli),
-   obecnie jakość modeli text to audio jest niska
-   jednak w przyszłości zadanie to będzie prawdopodobnie o wiele prostsze z pomocą modeli multimodalnych, które są zdolen do generowanie dźwieku

mixture of agents - modele open source współpracujące ze sobą, które są ws tanie osiągnąc lepsze rezultaty niż gpt-4o

## Multimodalność

-   zamiana tekstu na formę audio - obiwązują limity danych wejściowych oraz wyjściowych
-   stworzenie promptu, który poradzi sobie z dopasowaniem stylu wypowiedzi
    -   prompt nie powinien wskazywać na generowanie treści na podstawie obecnej, lecz na jej transformację wg określonych zasad
        -   to pozwala na zachowanie spójności stylu
-   warto zwrócić uwagę na to, aby model zadbał o poprawną odmianę słów jeśli transformumemy tekst, który jest po polsku

### Kontekst

-   klasyfikacja danych wejściowych
    -   przykład tworzenia notatek na podstawie nagrania audio - przypisanie kategorii pozwala na ustalenie kontekstu i np. zastosowanir odpowiedniego formatowania notatki
    -   notatki na podstawie obrazu - nadawanie kontekstu na podsatwie danych pochodząych z urządzenia, które utworzyło notatkę (np. lokalizacja, inne metadane)

## Dokumenty

-   limity wynikajce z okna kontekstowego
    -   dzielenie materiału wejściowego na fragmenty - chunking.
    -   ważne wówczas jest utzrymanie uwagi modelu na kontekście
        -   podążanie za instrukcjami, rozumienie treści - jest to wciąż wyzwaniem dla modeli

**Dokument** to obiekt składający się z głównej treści oraz metadanych, które opisują jego cechy i nadają kontekst.
W kontekście LLM zwykle jest to mały fragment dłuższej treści z zewnętrznego źródła,
który dodajemy do indeksów silników wyszukiwania na potrzeby Retrieval-Augmented Generation lub innych scenariuszy wymagających odnalezienia konkretnych zestawów informacji.

struktura metadanych:

-   info nt. żródła i dokumentów sąsiadujących
-   info pozwalające nakreślić kontekst (np. z jakiego pliku pochodzi dokument)
-   info pozwalające skutecznie filtrować dokumenty (data, rola, uprawnienia czy kategoria)
-   info pozwalające na kompresję treści dokumentu (np.linki)

Zatem warto myśleć o dokumentach tak, że gdy budujemy je na podstawie jakiegoś pliku czy bazy danych,
to musimy wygenerować je tak, aby model posiadał wystarczający kontekst na ich temat oraz aby silnik wyszukiwania mógł skutecznie do nich dotrzeć

generowanie treści dokumentów:

-   text splitting
-   generowane przez model lub człowieka
-   LangChain: dzielenie na podstawie długości lub kolejnych znaków specjalnych
-   recursive text splitting, dzielenie po akapitach, podwójnej linii, nowej linii, kropce, wykrzykniku, itd.
    -   mniejsze prawdopodobieństwo zgubienia kontekstu
-   techniki te przeciętnie się sprawdzają w praktyce
-   Ponoć zastosowanie "overlap" bywa skuteczne (nakładanie na siebie sporej częsci dokumentuów, np. 50%)

sugestia anthropic celem utzrymania okontesktu dokumentów

-   każdy dokument należy przeprocesować przez LLM i prompt, który nada mu kontekts na podstawie całego dokumentu
    -   cache'owanie promptów jest tutaj istotne
    -   zastosowanie gemini pozwoli przetworzyć duże zestawy danych

### Nieustrukturyzowane dane

-   techniki podobne jak w multimodalności; połączeniu wielu formatów

### Kategoryzacja i filtrowanie

-   wyszukiwanie wygenerowanych dokumentów na podstawie zbliżonego opisu
    -   ograniczanie liczby zwracanych wyników
    -   precyzyjne zapytanie celujące w konkretne dokumenty daje wyższą skuteczność, o ile opisy narzędzi są wystarczająco dobre
    -   nieprecyzyjne zapytanie - gorsza skuteczność + ograniczenie liczby wyników
-   ważne są kategorie i tagi, które pomagają w przypadku nieprecyzyjnych zapytań

## Wyszukiwanie semantyczne

bazy wektorowe

-   qdrant
-   [przegląd](https://benchmark.vectorview.ai/vectordbs.html) dostępnych rozwiązań

model do embeddingu

-   jina-embeedings-v3
-   text-embedding-3-large (start)

określenie struktury kolekcji i zawartych w niej dokumentów

-   bardzo ważny element procesu łączenia LLM z zewnętrznymi danymi, od tego zależy jakośc wypowiedzi
-   jednak osiągnięcie 100% precyzji obecnie nikomu się nie udało
    -   spodziewane błędy na poziomie 3-6%
    -   duża ilość danych utrudnia precyzyjne wyszukiwanie: wprowadza szum (noise)
-   istotna jest strategia wyszukiwania łącząca różne podejścia
    -   embedding, bm25, contextual embedding, contextual bm25
-   embedding -> sposób reprezentacji danych za pomocą liczb, które mają opisać ich znaczenie na
    -   embedding jest nieodwracalny
    -   oryginalne informacje muszą być przechowywane, ponieważ nie mamy możliwości odzyskania ich z embeddingu; najlepiej nie tylko w bazie wektorowej
    -   jeśli dane są potrzebne tylko do wyszukiwania, należy je synchornizować, przynajmniej częściowo między klasyczną bazą danych a wektorową
        -   rekordy muszą mieć wspólny identyfikator
        -   aplikacja musi uzwględniać spójność danych
-   potrzeby analizy i wyszukiwania
    -   przechowywane w formie obiektów łączących ze sobą embedding i metadane
    -   obiekty są nazywane punktami/dokumentami, są przechowywane w bazie wektorowej, która jest silnikiem wyszukiwania
-   wzbogacenie danych o opisy pozwala na lepsze kojarzenie i kategoryzowanie
-   w zależności od modelu wykorzystywanego do embeddingu, będziemy się posługiwać inna liczbą wymiaróœ i ta liczba będzie stała dla całej kolekcji
-   przykład: dimensions=1024, vector składa się z 1024 liczb zarównbo dla dokumentuy zawierającego jedno słowo jak i takiego, który zawiera kilkanaście zdań - tyle samo przestrzeni na opisanie

zapytanie do bazy wektorowej

1. zamiana na embedding
2. zestawienie z przechowywanymi danymi w kolekcji
3. metadane służą do filtrowania na etapie wyszukiwania

-   powinno się mieć jedną kolekcje na jedną aplikację
-   jedna baza danych dla jednej aplikacji
-   baza wektorowa może przechowywać wektory opisujące zarówno tekst jak i obrazy
    -   proces wyszukiwania wygląda tak samo, jednak należy unikać wyszukiwania dwóch rodzajów treści jednocześnie

zasady

1. każdy dokument ma swój unikalny identyfikator (UUID)
2. dokumenty powinny być synchronizowane z bazą danych
3. metadane muszą posiadać właściwości pozwalające zawężenie wyszukiwania
4. filtry mogą być ustawiane programistycznie i/lub przez model
5. metadane mogą posiadać właściwości określające ich dostępność (rola/subskrypcja)
6. treść dokumnetów powinna być możliwie monotematyczna, aby opisanie jej znaczenia pozwoliło na przyszłe dopasowanie do zapytań
7. długośc dokumentu nie może przekraczać limity kontekstu modelu do embeddingu oraz modelu, który będzie przetwarzał jego treść (zarówno input jak output context limit)
8. zapytanie użytkownika może być wzbogacane, rozszerzane lub doprecyzowywane w celu zwiększenia pradwoopodobieństwa dotarcia do istotnych dokumentów
9. zwrócone dokumenty mogą zostać ocenione przez model pod kątem ich przydatności dla zapytania (re-rank)

### Naive RAG

-   dzielenie dużej treści na mniejsze fragmenty, indeksowanie, oraz późniejsze wyszukiwanie na podstawie oryginalnego zapytania użytkownika
-   problem: oryginalne zapytanie nie zawsze wystarcza do poprawnego odnalezienia danych

Poprawienie precyzji wyszukiwania

-   np. zawarcie nazwy autorów w danych zawierającyh cytaty z ich książek: dodaje filtr
    -   dodanie klasyfikacji zapytania pod kątem autora: dodanie filtru dla przeszukiwaniych dokumentów

Problem: zapytanie wymagające użycia kilku dokumentów

-   narzucenie limitu dokumentów - nie jest wystarczające
-   solution: zaangażowanie modelu to przeanalizowania czy dokument jest istotny czy nie (re-rank)
    -   zwróćenie większej ilości dokumentów i oceninie przez model, które są najbardziej przydatne
-   wzbogacenie/transformacja: zapytanie może być na tyle nieprecyzyjne, że ciężko ustalić o co w nim chodzi. Model może poprawić jakość zapytania

### Ograniczenie zastosowania LLM

Why?

-   spowolnienie logiki aplikacji
-   czasem nie potrzebujemy rozumowania, ale język naturalny nie pozwala na zakodowanie logiki

## Wyszukiwanie hybrydowe

-   klasyczne wyszukiwanie (precyzyjne) + wyszukiwanie wektorowe (bardziej ogólne)
-   wynik ewolucji technik wyszukiwania
-   TF-IDF wyszukiwanie częstotliwości słów - dobre rozwiązanie gdy użytkownik wie, czego szuka
    -   BM25 - rozwinięta wersja TF-IDF
-   wyszukiwanie semantyczne potrtafi rozpoznać kontekst
    -   kluczowa cecha przy użyciu LLM

Hybrydowa technika BM25 + wyszukiwanie semantyczne

-   najpierw BM25: jak dobrze dokumenty odpowiadają pytaniu na podstawie słów kluczowych
    -   prezeszukiwanie dużej ilości dokumentów
    -   eliminowanie potencjalnie niepasujących dokumentów
    -   prosty i szybki algorytm
-   model językowy - re-ranking; uporządkowanie wg trafności
    -   z użyciem wektorów
    -   semantyczne podobieństwo do zapytania, mimo niepokrywania się słów kluczowych
    -   "rozumienie" skrótów, synonimów, itd.

Kiedy używać

-   kiedy szukanie po słowach kluczowych to za mało
-   gdy znajomość kontekstu może poprawić jakość wyszukiwania
    -   sklepy internetowe, wyszukiwanie produktów
    -   systemy rekomendacyjne
    -   przetwarzanie dużej liczby dokumentów
        -   terminologia techniczna, wieloznaczne pojęcia

Reciprocal rank fusion (RRF)

-   wybieranie elementów z różnych wyników wyszukiwania i łączenie ich w jeden wynik
    -   jedna, wspólna zoptymalizowana lista
    -   przykład: jedno zapytanie do qdrant w formie języka natruralnego, a drugie do algolii w formie słów kluczowych, klasyfikacja wyników z obu list
    -   czasem wyszukiwanie smenatyczne przyniesie o wiele lepsze wyniki, czasem to wyszukiwanie tradycyjne okaże się precyzyjniejsze, a czasem fuzja obu metod da najlepszy wynik
-   re-ranking
    -   LLM analizuje wynik w kontekście zapytania, poprawia trafność pod kątem semantycznym

połączenie szybkich metod wyszukiwania i rozumienia kontekstu, co daje bardziej trafne odpowiedzi

bardzo przydatne w branżach pełnych skrótów, terminów technicznych, itd.
zankomite w wyniki w przypadku konkretnych zapytań

### Ograniczenia

-   lepiej stosować tradycyjne metody jeśli liczba danych jest ogromna
-   potrzeba dużej mocy obliczeniowej - spowolnienie procesu
-   wdrożenie jest bardziej skomplikowane
    -   konfiguracja zabiera dużo czasu
-   postgres od dawna oferuje mechanizm semantycznego wyszukiwania

### Przyszłość

konsumenci zmieniają przywyczajenia - coraz częściej zamiać używać google/stack overflow od razu wyszukują odpowiedzi w LLM-ach (chat GPT, perplexity, itd.)

### Implementacja

-   identyfikatory rekordów - baza danych jest źródłem prawdy
    -   synchornizacja danych pomiędzy DB, silnikiem wyszukiwania, bazą wektorową
    -   sync nie zawsze opeira się o te same dane, np. qdrant zawiera wektory, które nie są przechowywane w inncyh miejscach

#### Co gdzie?

Baza danych

-   dane wyświetlane po stronie interfejsu

Silnik wyszukiwania

-   dane potrzebne do wyszukiwania

jakich danych brakuje w dokumentach i które mogą być utworzone z pomocą LLM?

-   klasyfikacja, tytuły, opisy, streszczenia i inne formy transfomracji

czy duża liczba danych utrufni wyszukiwanie?

-   potrzeba dodatkowych filtrów i kategorii, które będa uzwględnione an etapie indeksowania oraz przeszukiwania

które dane są stałe, a które tymczasowe?

-   łatwość wczytywania

#### Wzbogacanie zapytań

Gdy zapytanie jest zbyt ogólnikowe, możemy zaangażować LLM celem zmodyfikowania zapytania i wygenerowania nowej serii zapytań. Prompt określa zasady interakcji z użytkownikiem.

#### Filtrowanie i przetwarzanie wyników

Czasem intersuje nas nie wybraniue kilku dokumentów, lecz pobranie wszystkich z danej kategorii. Wówczas będziemy chcieli zaangażować albo tylko bazę danych, albo silnik wyszukiwania.
Wówczas rolą LLM będzie zwrócenie identyfikatorów, naz kategorii, filtrów, które mają być zastosowane.

e.g. "Wypisz wszystkie książki autorów urodzonych w 1900 roku"

-   duża liczba dokumentów zawierających mnóstwó nieistotnych treści z punktu widzenia zapytania
-   można podsumować wyniki i zwrócić je zamiast pełnej treści dokumentów
    -   wynik taki można zachować na potrzeby przyszłych interakcji, aby nie powtarzać procesu

LLM

-   może decydować o tym, które obszary bazy danych filtrować w celu pobrania dokumentów pasujących do filtra, a nie zapytania
-   może przepracować wynik w celu ekstrakcji istotnych informacji

#### Metadane

-   przydatne podczas filtrowania na etapie wyszukiwania, ale także na etapie dostarczania treści dokumentu do kontekstu.
-   główna treść dokumentu może być niewystarczająca, aby LLM był w stanie skutecznie się nią posługiwać
-   w kontekście powinny się znajdować najważniejsze dokumenty
-   składnia zbliżona do XML jest przydatna w formatowaniu kontekstu
    -   oddzielanie od siebie kontekstów, fragmentów znajdujących się węwnątrz nich

### RAG (retrieval-augmeneted generation)

-   budowanie RAG bez wyszukiwania hybrydowego nie powinno być brane pod uwagę
-   uniwersalne systemy RAG próbujące się dopasować do dowolnego rodzaju danych są jeszcze poza naszym zasięgiem
    -   jeśli wysoka skuteczność jest ważna
-   ogromną rolę pełnią elementy wspierające proces wyszukiwania, takie jak wzbogacanie zapytań, ocenianie rezultatów przez model

## Źródła danych

dane wrażliwe

-   model może "nauczyć się" ich i je upublicznić
    -   np. wygenerować dokumenty, zasugerować dane poufne, itd.
-   uczenie LLMów
    -   zabezpieczanie danych tak aby ich nie ujawnił

model powinine mieć jak najmniejszy kontakt ze światem zewnętrznym poprze programistyczne ograniczenia - np. gdy model tworzy mail, powinien to byuć draft, który ma byc zatwierdzony przez użytkownika przed wysłaniem - limitowanie domen, które mogą być przeszukane lub scrapowane

### zabezpieczanie danych

    -   filtrowanie danych wejściowych z danych wrażliwych
        -   narzędzia NLP do wykrywania danych wrażliwych, np. nr telefonu, adres i zamiana na neutralne hasła
            - generowanie denychb testowych w `promptFoo`
        -   prywatność różnicowa - dodawanie szumu do danych
            -   np. model uczy się trendów zakupowych, ale nie wie kto konkretnie co kupił
            -   zabezpieczenie przed odtworzeniem indywidualnych danych zapytaniami statystycznymi
        -   confidential computing
            -  enklawy - zamknięte przestrzenie w procesorze/systemie operacyjnym, które nie udostępniają danych wrażliwych
            -  izolowanie na poziomie sprzętowym; wyłącznie model widzi przetwarzane informacje
            -  rozwijane przez np. Nvidię
            -  zabezpiecza przed atakami na system operacyjny lub przejęcie serwera
               -  dane mogą być niedostępne nawet dla pracowników wewnętrznych
         -  maskowanie danych
            -  zastępowanie danych wrażliwych tzw. maskami - wyglądają jak rzeczywiste dane, ale nie ujawniają ich rzeczywistej wartości

### monitoring - śledzenie i reakcja oprócz działań prewencyjnych

    -  logowanie i audyt
      - kto miał dostęp, kiedy i co zrobił
      - w razie incydentu umożliwia identyfikacje co stało się z danymi
      - czy dostęp do danych był zgodny w polityką bezpieczeństwa?
    - anomaly detecyion
      - wyłapywanie nietypowych wzorców
        - np. do systemu trafiają dane o nietypowej strukturze
        - zdane wejściwe są zbyt specyficzne
      - alert przed rozpoczęciem przetwarzania danych
      - wykrywanie jail brake'ów
    - traceability
      - śledzenie danych od momentu ich wprowadzenia do systemu aż do ich przetworzenia
      - oznaczenie metadanaymi pozwalający na prześledzenie prztewarzania
      - czy były zastosowane zabezpieczenia podczas przetwarzania?

### disaster handling

reagowanie na incydenty - nieodzwony element zarządzania ryzykiem

    -   model zdołał "nauczyć  się" danych wrażliwych
        -  należy je usunąć - "REDAKCJA"
           -  re-training na danych zastępczych, fine-tuning celem pozbycia się wrażliwych danych
           -  re-training ma "przykryć"/"nadpisać" ujawnione dane bez konieczności kasowania modelu
        -  transparentność - ekstremalne podejście
           -  informowanie o incydentach, wykorzystywanie do dalszych badań do zapobiegania incydentom w przyszłości
        -  informacje mogą nadal się pojawiać nawet po oczyszczeniu modelu
           -  prompt filtering - blokowanie zapytań, które mogą prowadzić do ujawnienia danych
           -  model, który przeszedł incydent może dalej zawierać śladowe ilości danych wrażliwych
        - pełna regeneracja modelu
          - gdy wyciek dotyczył dużego zakresu danych
          - ponowny trening z zabezpieczonymi danymi

Zabezpieczenia muszą ewoluować wraz z rozwojem technologii
Audyt musi być regularny - jak przegląd w samochodzie, nawet gdy wszystko działa na pierwszy rzut oka, trzeba sprawdzić czy nie ma usterek

### Praca z plikami i katalogami

pliki wczytywane do kontekstu LLM powinny być zapisywane także na dysku (sam plik) oraz w bazie danych (info nt. pliku)

-   dane mogę okazać się przydatne w przyszłości
-   proces przetwarzania może składać się z wielu kroków
-   wgrane pliki powinny być podzielone na kategorie
-   struktura katalogów powinna uwzględniać
    -   datę utworzenia - aby uniknąć mnóstwa plików w jednym folderze
    -   uuid pliku - uniknięcie przypadkowego nadpisania istniejącego dokumentu
    -   warto zachować oryginalną nazwę pliku zarówno na dysku jak i w db
    -   treść plików warto przechowywać na podstawie mime-type, a nie samej nazwy (o ile nie mowa o pliku tesktowym)
    -   pliki tymaczowe należy usuwać tak szybko, jak to możliwe
-   rekord w DB opisujący plik, szczególnie o złożonej strukturze jak `.xlsx`, może zawierać linki do zrzutów ekranu, co może pozwolić modelowi na wizualne podejrzenie jego zawartości - w tym przypadku struktury tabeli czy diagramów

### Wczytywanie plików

-   tekst, audio, obrazy - stotunkowo prosty proces wczytywania
-   problem: duże pliki, duża liczba plików, lub to i to; złożone formaty takie jak `.pdf`, `.docx`, `.xlsx`
    -   możliwośći dotarcia do treści różnią się od języka programowania
    -   istnieje wiele narzędzi pozwalających na konwersję formatów `.xlsx` -> `.docx/.csv` -> `HTML`
        -   wiekszość jednak nie radzi sobie ze strukturam

Przykładowe wczytywanie plików

-   `.txt`: wczytanie zawartości i zamieniane na dokument, ewnetualnie podzielony na fragmenty
-   `.docx, .xlsx`: wgrywane na Google Drive, następnie pobierane w formie `HTML` lub `CSV` i prztewarzane na markdown. Dodatkowo pobierane są w formacie `.pdf`, którego strony zamieniane są na `jpg` (zrzuty ekranu)
-   `.pdf`: najbardziej problematyczny - zrzuty ekranu i pobranie treści, jeśli to możliwe
-   `audio`: wykrywanie ogólnego poziomu ciszy, następnie segmentowanie na fragmenty ciszy i fragmenty w których ktoś mówi. Dzielenie pliku na kawałki, uzwględniając bufor na początku i końcu każdego fragmentu. Pliki są zamieniane an format `.ogg` (bardzo optymalny) i poddawane transkrypcji przez OpenAI Whisper
-   `obrazy`: przeprocesowanie przez VLM celem uzyskania tesktowej formy obrazu

utworzone dokumenty są wczytywane do bazy danych oraz kontekstu

### Proxy dla zewnętrznych API

-   czasem dane LLM nie pochodzą z pliku, ale zewnętrznej usługi, np. Notion
    -   można łączyć się bezpośrednio z usługą, jednak warto rozwinąć własne proxy między agentem a usługą
        -   większa elastyczność, możliwość dopasowania formatu odpowiedzi, błędów, połaczenia ze sobą różnych narzędzi
        -   cache'owanie?

### strony WWW

-   dokumentem mogą też być strony WWW
    -   wykorzystanie FireCrawl do pobierania treści ze stron (który przetwarza treść strony na format dokumentów i będzie ona gotowa do pracy z LLM, a także zapisana do markdown)

### zapamiętywanie informacji od użytkownika

-   sama interakcja z LLM może być źródłem danych oraz dane pochodzące od użytkownika i modelu
    -   taka interakcja jest zwykle wielopoziomowa i "przepisywanie" treści za każdym razem nie ma sensu
    -   wyposażenie modelu w możliwość zapisania treści pliku tak, aby w dalszych krokach posługiwał się wyłącznie identyfikatorem
        -   np. model posiada informacje nt. dłuższego dokumentu wraz z instrukcją by w razue potrzeby cytowania zawartośći dokumentu, powinien korzystać z placeholder'a (uuid). Później możemy programistycznie zastąpić placeholder treścią dokumentu, która bedzie przekazana do kolejnego promptu, albo zwrócona użytkownikowi
    -   model powinien móc odczytać i zapisywać pliki
    -   model powinien móc ten plik udostępniać i uzyskać jego adres URL na potrzeby dalszej pracy
    -   model powinien móc posługiwać się identyfikatorem/placeholderem pliku dzięki którym nie będzie konieczne przpisywanie długich treści (co może być niemożliwe ze względu na limity kontekstu)
    -   praktycznie każdy rodzaj danych na których pracuje model, powinien być sprowadzony do jednego formatu, wspólnego dla wszystkich rodzajów treści

### Organizowanie danych w DB

możliwe scenariusze:

-   połączenie dokumentu z użytkownikiem z zablokowaniem dostępu do jego treści innym użytkownikom
-   połączenie dokumentu z konewrsacją, umożliwiające przywołanie kontekstu w razie wznowienia rozmowy
-   połączenie dokumentu z zadaniem realizowanym przez agenta i/lub etapem większego procesu, na wypadek koniecznośći wznowienia go
-   zapisywanie fragmentów przeprocesowanej treści, np. tłumacząć długo dokument, zapisujemy ukończone fragmenty tak, aby móc wznowić proces w miejscu, w którym pojawił się problem
-   zapisywanie oryginalnej treści dokumentu oraz jego zmienionych form na wypadek potrzeby odwołania się do niej lub powtórzenia procesu przetwarzania
-   zapisywanie info o dacie wygaśnięcia dokumentu, szczególnie w przypadku plików udostępnionych pod publicznym adresem URL
-   powiązanier wpisu w DB z zawartościa pliku na dysku. W przypadku krótszych dokumwentów (np. wygenerowanych chunków) wskazane jest przechowywanie ich treśći bezpośrednio w DB

## Bazy grafowe

-   analiza zależności pomiędzy słowami i pojęciami
-   dane w strukturze grafu
    -   nodes (węzły/wierzchołki) - reprezentują obiekty
    -   relationships/links/edges (krawędzie) - reprezentują zależności pomiędzy obiektami
    -   labels
    -   properties - kązdy węzeł i relacja mogą mieć wiele właściwości
        wydajne przeszukiwanie i analiza zależności

social graph - reprezentacja relacji między użytkownikami, np. Facebook

-   co robią, lubią twoi znajomi
    interest graph - reprezentacja zainteresowań użytkowników, np. TikTok
-   zainteresowania użytkownika: użytkownik/treść, wymagające analizy treści

relacyjna baza danych

-   SQL, primary keys, łączenie tabel - szybko zapytanie może stać się bardzo skomplikowane
    grafowa baza danych
-   `cipher`, `neo4j`, relacje między węzłami
    -   łatwiejsze zapytania, wydajniejsze przeszukiwanie

### Sieci semantyczne

-   słowo - węzęł
    -   synonimy, antonimy, pojędzia podrzędne - krawędzie
    -   pomaga w zrozumieniu znaczenia słów

### Typy baz grafowych

-   neo4j: język cipher, grafy
-   arangoDB: multi-model, grafy, dokumenty, klucze-wartości, SQL-like
-   janusGraph: skalowalność, do dużych zbiorów danych, złożone zależnośći
    -   integracja z silnikami wyszukiwania
-   Amazon Neptune: różne rodzaje grafów, integracja z AWS
-   TigerGraph: szybkie analizy w czasie rzeczywistym, duża ilość danych bez utraty wydajności

### Kiedy NIE używać baz grafowych

-   gdy dane nie są gęsto powiązane - RDS jest wystarczające
-   brak zaawansowanych analiz relacji: np. e-commerce, gdzie użytkownicy, produkty, itd. nie zależą tak bardzo od siebie; grafy mogą być przesadne
-   wymagają zaawansowanej wiedzy i infrastruktury; dodatkowe koszty

### zastosowanie baz grafowych w systemach RAG

-   "tradycyjne" flow:
    -   zapytanie -> embedding -> wyszukiwanie w bazie wektorowej -> znalezienie dodatkowego kontekstu w bazie relacyjnej lub noSQL na bazie wspólnego identyfikatora
        -   dodajemy uzyskany kontekst do odpowiedzi
-   problem pojawia się, gdy zapytanie dotyczy nie jednej, konkretnej rzeczy o danych cechach, lecz jakiegoś zbioru, które łączych zestaw określonych cech
    -   np. "pokaż mi wszystkie książki, które są zarówno o historii, jak i napisane przez autora urodzonego w 1900 roku"
    -   wówczas jest o wiele cięzej znaleźć takie wyniki w bazie relacyjnej na podstawie słów kluczowych albo dopasowania znaczenia

Neo4j

-   możliwość dodania vector indexu, który pozwala na przechowywanie embeddingu oraz przeszukiwanie dokumentów

### Strukturyzowanie danych w bazie grafowej

https://microsoft.github.io/graphrag/
LangChain

^ konwersja nieustrukturyzowanego tekstu na serię dokumentów oraz połączeń pomiędzy nimi

Domyślne prompty służące do wypisywania podnmiotów i relacji, tworzeniu podsumowań, opisu stanu podmiotu, opisanie zależności pomiędzy podmiotami:
https://microsoft.github.io/graphrag/prompt_tuning/overview/

Aby uniknąć duplikacji danych związanych z dowonlnością tworzernia dokumentów, należy ustalić konkretną sciężkę uzwględniająca dostarczanie, organizację, odzyskiwanie i aktualizację treści

-   Praca z bazą grafową opiera się o dwa etapy: strukturyzowania danych i ich późniejszego wyszukiwania.

-   Dane na potrzeby bazy grafowej muszą zostać przekonwertowane na formę Node (Dokument) + Edge (Połączenie) z opisującymi je właściwościami.

-   Transformacja zwykle będzie odbywać się z pomocą LLM i serii promptów odpowiedzialnych za pobieranie informacji oraz tworzenie powiązań.

-   Ustrukturyzowane dane trafiają wówczas do bazy grafowej / indeksu wektorowego. Aktywność ta kończy etap strukturyzowania danych.

-   Proces wyszukiwania/wczytywania informacji na potrzeby kontekstu dla LLM odbywa się na podobnych zasadach jak w przypadku bazy wektorowej czy klasycznych silników wyszukiwania. Jednak w tym przypadku celem jest wygenerowanie zapytania Cypher (lub serii zapytań) i połączenie danych w jeden kontekst.

### Wyszukiwanie

połączenie gotowej bazy grafowej z LLM

wykorzystanie LLM do generowanie zapytań SQL/cipher - dobre na własny użytek, ale nie jest to dobry pomysł do przeszukiwania całych baz danych z powodu potencjalnego prompt injection

model powinien wskazywać obszary i zapytania, które programistycznie przekształcimy na docelowe zapytania, narzucając przy tym własne ograniczenia, takie jak poziom uprawnień dostępu do wybranych danych

E.G. `Neo4JService`- interfejs do komunikacji między bazą grafową a LLM

-   model zwraca JSON, nie składnię Cypher, my dokonujemy transformacji danych programistycznie

Krok po kroku (implementacja `GraphRAG`):

1. Analiza zapytania: Jest to prompt decydujący o tym, jakie rodzaje akcji mają być podjęte (READ|WRITE|ANSWER) przez asystenta.
2. Przypominanie: Jest to seria promptów, w przypadku której dochodzi do opisania strategii wyszukiwania oraz zapytań w celu wczytania danych do kontekstu
3. Zapamiętanie: Jeśli model zdecyduje się na zapisanie informacji, to uruchamiany jest prompt opisujący nowy dokument oraz logika, która dodaje go do pamięci (w naszym przykładzie nie rozszerzałem go o tworzenie relacji pomiędzy dokumentami)
4. Odpowiedź: Na podstawie pobranego kontekstu generowana jest odpowiedź

koniecznie jest rozbudowanie go o logikę łączenia ze sobą rekordów, a także weryfikacji tego, czy rekordy nie są zduplikowane

## Interfejs

Narzędzia dla agentów nie powinny realizować krytycznych procesów, ich kontakt ze światem zewnętrznym powinien być możliwie ograniczony, a podejmowane akcje odwracalne.

### Narzędzia dla LLM

-   jego nazwa musi być oczywista, zwięzła, unikatowa i charakterystyczna, aby model mógł z wysoką pewnością stwierdzić, które narzędzie wybrać spośród dostępnej listy umiejętności
-   każde narzędzie powinno zawierać zwięzły opis - umożliwia wybór oraz przedstawai możliwości i ograniczenia
-   narzędzie musi posiadać instrukcję obsługi, która może mieć formę jednego/wielu promptów. Wynik - obiekt JSON/yaml zaweirający właściwości do uruchomienia funkcji
-   narzędzie musi mieć zdefiniowaną strukturę danych wejściowych, zależności, danych wyjściowych oraz listę dostępnych akcji - możliwość korzystania w różnych konfiguracjach

Aspekty związane z logiką używania narzędzia:

-   zestawy danych testowych, testy autmatyczne dla wszystkich promptów
-   zapisywanie historii podjętych działań, pozwalających na wczytanie zapytania oraz wyników dla danej konwersacji
-   obsługa błędów z opcją automatycznewgo naprawienia
-   system wykonywania akcji asynchronicznych (kolejka, eventy, harmonogram)

Narzędzie - niezależny moduł aplikacji, którym może posługiwać się LLM.

### Interfejs narzędzi

-   narzędzia są uruchamiane przez model indywidualnie, ale także w połączeniu
    -   np. agent otrzymuje polecenie "Codziennie rano wejdź na stronę X, napisz streszczenie ich treści i wyślij mi na maila"
        -   model ustala plan akcji i wykonuje je

## Zewnętrzne źródła danych

-   źródła danych, które są pobierane w programistyczny sposób, a nie są podawane przez użytkownika, np. muzyka, pogoda, lokalizacja
    -   pobierane w czasie rzeczywistym lub aktualizowane cyklicznie i wczytywane w razie potrzeby
    -   dane dostarczane przez użytkownika lub innych agentów AI w trakcie interakcji

### Pliki

-   model nie ma problemu z generowaniem treści dla dokumentów tekstowych. `Markdown`, `JSON` czy `CSV` mogą być także programistycznie przekonwertowane na formaty binarne, takie jak `PDF`, `docx` czy `xlsx`
    -   samo umieszczenie pliku na dysku oraz wygenerowanie linku do niego wymaga narzędzia

Dwa sposoby tworzenia pliku

-   jeden dostępny dla użytkownika, drugi dla modelu
    -   upload dla modelu: wczytanie pliku jako dokumentu i zapisanie w bazie danych, dodanie ID konwersacji do metadanych pliku
        -   odpowiedź zwraca informacje nt. pliku, łącznie z adresem URL, którym może posłużyc się LLM
        -   produkcyjna implementacja:
            -   trzeba sprawdzać mimeType wgrywanego pliku i odrzucamy te, które są niezgodne ze wspieranymi formatami
            -   sprawdzanie rozmiaru pliku
            -   link kierujący do pliku powinien wymagać uwierzytelnienia, np. klucza API lub aktywnej sesji

Tworzenie pliku za pomocą LLM

-   musimy uwzględnić napisanie treści
    -   jeśli zapisanym plikiem jest np. wygenerowane tłumaczenie, wolelibyśmy uniknąć ponownego przepisywania dokumentu
-   generowanie nazwy + wskazanie ID wczytywanej treści, które jest np. wynikiem tłumaczenia

### Planowanie

posługiwanie się narzędziami przez LLMy - programistyczny interfejs + prompty
logika może mieć charakter liniowy lub bardziej agencyjny, zdolny do wychodzenia poza ustalony schemat i rozwiązywania porblemów z kategorii "open-ended"

scenariusz środkowy

-   model wyposażony w narzędzia ma możlwiość korzystania z nich w dowolnej kolejności oraz ilości kroków
    -   nie może zmienić raz ustalonego planu oraz wracać do wcześniejszych kroków
    -   brak odporności na nieprzewidziane scenariusze - polecenia muszą być precyzyjne
    -   model taki nie sprawdzi się produkcyjnie, ale może pracować "w tle" i zapisywać efekty swojej pracy w DB i np. wysyłać na maila
-   ograniczona wiedza początkowa - nie możemy od razu wygenerować wszystkich paramtetrów potrzebnych do uruchomienia narzędzi
    -   ustalenie listy kroków; zapisanie notatek lub zapytań, które mają charakter poleceń jakie model generuje "Samemu sobie" - należy zachować kolejnośc działań
    -   dopóki modele nie będą dysponowały większą zdolnością do zachowania uwagi, proces planowania i podejmowania działań musi ybć podzielony na małe, wyspecjalizowane prompty
        -   problemem jest dostarczenie wszystkich danych potrzebnych do podjęcia dalszych działań bez dodwania zbędnego "szumu"

zapisywanie dokumentów w DB z metadanymi, które zawierają szczegółowe informacje o dokumencie

-   metadane nadają kontekst
-   takie informacje mogę być przywołane w każdej chwili do kontekstu promptu systemowego wraz z informacją skąd pochodzą oraz gdzie możemy się dowiedzieć więcej na ich temat
-   w taki sposób można zapisywać dane z zewnętrznych źródeł, a następnie wczytywać do konwersacji w formie "stanu" - obiektu stanowiącego pamięć krótkoteterminową modelu
    -   stan może zawierać:
        -   kontekst (umiejętności, info z otoczenial lista podjętych akcji, wczytanych dokumentów, podsumowanie rozmowy, omawiane słowa kluczowe, wczytane wspomnienia)
        -   informacje związane z rozumowaniem (akutalny status, dostępne kroki, aktualny plan działań, refleksja na jego temat, aktywne narzędzie)
        -   informacje nt. konwersacji (ID interakcji na potrzeby LangFuse, ID rozmowy, lista wiadomości, związane z nią ustawienia)

KONTEKST: wiedza z bieżącej interakcji, wiedza z pamięci długoterminowej, zmienne kontrolujące logikę po stronie programistycznej
WYMAGANIA: precyzyjne określenie, co jest dla modelu dostępne, a co nie - w przeciwnym razie szybko poajwią się problemy dotyczące samego modelu, albo barier wynikających z samej technologii (np. koniecznośc logowania na stronę www)

## Aplikacje i usługi

-   API aplikacji zewnętrznych mogą być wykorzystywane jako źródło danych, ale także jaako narzędzie do podejmowania działań
    -   połaczenie modelu ze światem zewnętrznym, np: Google Maps, Spotify, Resend, Speak
-   Narzędzia te mogą nie tylko odczytywać dane, ale także ja zapisywać, np. wysłać maila
    -   należy na nie nakładać programistyczne ograniczenia aby przechwycić ewentualne błędy lub do nich nie dopuścić
-   integrację z zewnętrznymi narzędziami należy rozważyć w oparciu o nieterministyczną naturę modeli językowych - jeśli zależy nam na precyzji, modele nie będą się do tego nadawać; czasem jednak niedeterministyczne odpowiedzi mogą stanowić wartość
-   należy ograniczyć uprawnienia modelu do tylko tych koniecznych - least privilege principle

### Interfejs dla narzędzi zewnętrznych

-   input/output: struktury dokumentów (treść + metadane) - spójność pomiędzy narzędziami
-   dane w postaci dokumentu mogą być zwracane zarówno w przypadku powodzenia jak i błędu - agent otrzymuje informacje, iż opreacja się nie powiodła, szczegóły błędu, co może doprowadzić do auotmatycznego rozwiązania

### Narzędzia no-code

-   tworzenie automatyzacji składającej się z kilku narzędzi i wyeksponowanym webhookiem
-   oszczędność czasu: programistyczne zaimplemntowanie intgeracji z kilkoma narzędziami zewnętrznymi jest czasochłonne
-   łatwość w edytowaniu logiki
-   umożlwia zaangażowanie osób niebędących programistami w tworzenie automatyzacji
-   jednorazowe rozwiązanie, PoC, prototypy
-   niemożność utrzytmywania integracji, np. zmieniające się API

Coraz częściej jednak LLMy poazwalają na samodzielne wygeenrowanie kodu służacego do integracji, co sprawia, że korzyci z narzędzi no-code stają się coraz mniejsze

Polecenia do integracji zewnętrznych będą zazwyczaj mało precyzyjne. Dlatego przy tworzeniu agenta, należy roważyć zapisywanie danych w formie dokumentów, same zpaytania oraz scenariusze, które będą obsługiwane - mowa o ogólnych zasadach, nie konkretnych przypadkach

Zagraj ulubioną muzykę - agent sam zadaje sobie pytania nt. ulubionej muzyki użytkowenika, nie ma za zadanie się tego dowiedzieć, lecz sam spekuluje na ten temat Spekulacyjne zadawanie pytań - **Speculative RAG** - próba doszacowania nieścisłości oraz odnalezienia brakującyh informacji. LLM może sam pomóc w generalizacji oraz określeniu schematów.

-> System sam musi dążyć do odkrycia/zdobycia brakujących informacji, korzystając z pamięci długoterminowej i/lub zewnętrznych usług
-> Rozwiązywanie problemów powinno opierać się na schematach, zasadach i regułach, a nie na pojedynczych przypadkach - nie da się ich wszystkich zaadresować

### Wysyłanie wiadomości

Wysyłanie wiadomności prywatnych lub SMS, których treść tworzy LLM prawie nigdy nie jest dobrym pomysłem.

Część zadań agenta jest asynchroniczna i może zajmować kilkanaście minut lub kilka godzin - wśród nich są akcje uruchamiane w odpowiedzi na zdarzenie lub ustaloną porę. Warto wówczas rozważyć integrację z API do SMSów, maili transkajcyjnych czy komunikaotrów typu Slack.

Usługi te jednak nie powinny być wykorzystywane do przesyłania masowych wiadomości. Lista kontaktów powinna być ograniczona lub wprost ustawiona tylko na nasz adres.

Poza limitami, największym wyzwaniem jest sprawienie, żeby LLM był w stanie wygenerować treść, która będzie wartościowa, co jest dość trudne.

Seria promptów może wspomóc skomponowanie bardziej wartościowej wiadomości, kolejną opcją jest wykorzystanie szablonów HTML do przygotwania np. neswlettera.

-   przesyłanie wiadomości z pomocą komunikatorów lub maila powinno być możliwe, ale mocno ograniczone. LLM decydujący się na wysłanie prywatnej wiadomości na przypadkowy adres to dość prawdopodobny scenariusz
-   formatowanie i zapis treści powinien być dopasowany z pomocą promptów oraz przykładów, które możliwie ograniczą domyślne zachowanie modelu zwiazane z genrowaniem bardzo ogólnych treści
-   nie mamy możliwości wprowadzania poprawek w wiadomościach - prompt musi być bardzo precyzyjny i dopasowany

Odpowiedź - dokument z treścią wiadomości + status akcji i ewentualna notka o niepowodzeniu

### Rozrywka

-   nie zawsze integracja będzie ustandaryzowana o interfejsy i gotowe do użycia API.
-   czasem potrzebne są "kreatywne" rozwiązania
-   przykład: powiadomienie w postaci komunikatu głosowego uruchamianego na komputerze.
    -   skrypt bash + polecenia `say` na MacOS"
-   spotify: polecenie głosowe typu "puść piosenkę ze shreka". Model wyszukuje tytuł piosenki, a następnie korzysta z API spotify, aby ją zagrać.

### Good practices

-   Ważna jest pośrednia warstwa abstrakcji między zewnętrznymi źródłami dannych a LLM
-   jeden prompt - jeden problem: podzielenie zadania na mniejsze części
-   generalizacja problemu: nie należy naprawiać promptu/integracji w oparciu o pojedyncze przypadki
-   pomoc modelu: w planowanie, pisaniu kodu, promptów, generowaniu danych testowych, debugowaniu
-   seria akcji: projektuj narzędzia tak, aby móc wykonywać kilka akcji jednocześnie - większa efektywność
-   wspólny interfejs: możliwość podłączenia wielu narzędzi, po które model może sięgać, gdy to koniecznie
-   komplet informacji: narzędzia powinny zwracać komplet informacji nt. pozyskanych danych lub błędów - w przeciwnym wypadku agent nie będzie potrafił się nimi posługiwać
-   ograniczenia: odciążanie modelu z podejmowania decyzji powinno być priorytetem - z uwagi na stabliność systemu, a także wydajność
-   ułatwienia: tam, gdzie to możliwe, warto stosować ułatwieniaw postaci np. narzędzi no-code, albo gotowych rozwiązań - pozwala skupić się na innych obszarach
-   obserwowanie: logowanie, zapisywanie kroków w bazie danych - dotęp do tych informacji powinien mieć zarówno człowiek jak i sam system
    -   zgromadzone dane moźna z czasem wykorzystać do budowania danych testowych oraz dalszego kształtowania promptów
