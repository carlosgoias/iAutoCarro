using System;

namespace iAutoCarro.Api.Entities
{
    public class Bus
    {
        public int Number { get; set; }

        public string Line { get; set; }

        public TimeSpan  EstimatedTime { get; set; }

        public TimeSpan WaitingTime { get; set; }

    }
}
