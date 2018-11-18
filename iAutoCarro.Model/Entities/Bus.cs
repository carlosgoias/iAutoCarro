

namespace iAutoCarro.Api.Entities
{
    using System;
    public class Bus
    {
        public int Id { get; set; }
        public int Number { get; set; }

        public string Line { get; set; }

        public TimeSpan  EstimatedTime { get; set; }

        public TimeSpan WaitingTime { get; set; }

    }
}
