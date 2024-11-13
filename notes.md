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
- możliwość przełączenia się na `groq`i skorzystanie z usługi EvlevenLabs z modelem "turbo"
  - szybszy czas reakcji
- zmiana formatu dźwięku z `.wav` na `.ogg` - pozwala na zmniejszenie rozmiaru pliku
- zastosowanie strumieniowania
- zwracanie odpowiedzi fragmentami do modelu Text-to-Speech, który umoliwia strumieniowanie generowanego nagrania
  - redukowanie czasu reakcji
- równoległe wykonywanie akcji, które nie są zależne od siebie
- zastosowanie mniejszych modeli i/lub korzystanie z platform oferujących szybką inferencję
- skrócenie wypowiedzi modelu
- Zastosowanie platform takich jak Hume.ai czy Bland.ai w sytuacji gdy zależy nam na budowaniu interfejsów umożliwiających rozmowy z LLM